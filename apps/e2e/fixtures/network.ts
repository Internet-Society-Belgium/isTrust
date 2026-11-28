import type { BrowserContext, Request, Route } from "@playwright/test";
import { doh_answer, is_doh_request } from "./doh";
import { response_key, type Scenario } from "./scenario";

// Every request of the browser context (pages, the extension popup, and its
// service worker) goes through one handler:
// - local pages (the website under test, extension pages) load normally;
// - DoH queries get an answer built from the scenario;
// - recorded responses are replayed;
// - anything else is aborted and reported, so the test fails at the end.
// Nothing reaches the real network.

export const local_url =
  /^(chrome-extension|data|blob):|^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//;

/** A page of the scenario's domain, opened as the active tab. */
export const stub_page = (domain: string) =>
  `<!doctype html><html><head><title>${domain}</title></head><body><h1>${domain}</h1></body></html>`;

export function is_domain_page(request: Request, domain: string): boolean {
  if (!request.isNavigationRequest()) return false;
  const { hostname } = new URL(request.url());
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export interface Network {
  /** Requests that matched nothing: each one is a test failure. */
  unexpected: string[];
}

export async function replay_network(
  context: BrowserContext,
  scenario: Scenario,
): Promise<Network> {
  const network: Network = { unexpected: [] };

  await context.route("**/*", async (route: Route) => {
    const request = route.request();
    const url = request.url();

    if (local_url.test(url)) {
      await route.continue();
      return;
    }

    if (is_domain_page(request, scenario.domain)) {
      await route.fulfill({
        contentType: "text/html",
        body: stub_page(scenario.domain),
      });
      return;
    }

    if (is_doh_request(request)) {
      await route.fulfill({
        contentType: "application/dns-message",
        body: doh_answer(request, scenario.dnssec.authenticated),
      });
      return;
    }

    const recorded = scenario.responses[response_key(request.method(), url)];
    if (recorded?.failed === true) {
      await route.abort("failed");
      return;
    }
    if (recorded !== undefined) {
      await route.fulfill({
        status: recorded.status,
        contentType: recorded.contentType,
        body:
          recorded.base64 === true
            ? Buffer.from(recorded.body, "base64")
            : recorded.body,
        headers: { "access-control-allow-origin": "*" },
      });
      return;
    }

    network.unexpected.push(response_key(request.method(), url));
    await route.abort("blockedbyclient");
  });

  return network;
}
