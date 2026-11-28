// `npm run record:e2e`: rewrites scenarios/<domain>.json from the real
// services. It runs the same flows as the tests (the website, and the
// extension, which calls more services because it can bypass CORS) and saves
// every response, trimmed so the file stays small. Review the diff before
// committing it: the expectations in the tests may need to follow.
import type { BrowserContext, Route } from "@playwright/test";
import { doh_authenticated, is_doh_request } from "../fixtures/doh";
import { is_domain_page, local_url, stub_page } from "../fixtures/network";
import { seed_random } from "../fixtures/random";
import {
  response_key,
  save_scenario,
  type RecordedResponse,
  type Scenario,
} from "../fixtures/scenario";
import {
  extension_id_of,
  launch_extension,
  test,
  wait_for_results,
} from "../fixtures/test";

const domain = "istrust.org";
// Some services (crt.sh in particular) can take minutes to answer.
const live_timeout = 4 * 60_000;

const is_text = (content_type: string) =>
  /json|text|javascript|xml/.test(content_type);

/** Requests in flight, to wait until the page stops calling services. */
let in_flight = 0;

async function network_quiet(): Promise<void> {
  let quiet_since = Date.now();
  while (Date.now() - quiet_since < 2_000) {
    if (in_flight > 0) quiet_since = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function record(context: BrowserContext, scenario: Scenario) {
  await seed_random(context);
  await context.route("**/*", async (route) => {
    in_flight++;
    try {
      await record_route(route, scenario);
    } finally {
      in_flight--;
    }
  });
}

async function record_route(route: Route, scenario: Scenario) {
  const request = route.request();
  const url = request.url();

  if (local_url.test(url)) {
    await route.continue();
    return;
  }
  if (is_domain_page(request, domain)) {
    await route.fulfill({
      contentType: "text/html",
      body: stub_page(domain),
    });
    return;
  }

  // A service that fails live fails in the browser too: the checks fall
  // back (e.g. to the next DoH resolver) as they would for a user.
  let response;
  let body;
  try {
    response = await route.fetch();
    body = await response.body();
  } catch {
    // An earlier pass may already hold a response for this URL (the extension
    // pass repeats the website's requests): a network error here must not
    // overwrite it.
    const key = response_key("GET", url);
    if (
      request.method() === "GET" &&
      !is_doh_request(request) &&
      scenario.responses[key] === undefined
    ) {
      scenario.responses[key] = {
        status: 0,
        contentType: "",
        body: "",
        failed: true,
      };
    }
    await route.abort().catch(() => undefined);
    return;
  }

  if (is_doh_request(request)) {
    if (response.ok()) scenario.dnssec.authenticated = doh_authenticated(body);
  } else if (request.method() === "GET") {
    const content_type = response.headers()["content-type"] ?? "";
    const recorded: RecordedResponse = is_text(content_type)
      ? {
          status: response.status(),
          contentType: content_type,
          body: trim(url, content_type, body.toString("utf8")),
        }
      : {
          status: response.status(),
          contentType: content_type,
          body: body.toString("base64"),
          base64: true,
        };
    scenario.responses[response_key("GET", url)] = recorded;
  }

  await route.fulfill({ response, body });
}

// The lists are stored one entry per line: keeping a few entries, plus the
// ones about the domain, is enough for the checks and keeps the file small.
function trim(url: string, content_type: string, body: string): string {
  // Web pages behind links the checks follow (an RDAP "related" link can point
  // to one): the checks only fail to parse them, so the content isn't needed.
  if (content_type.startsWith("text/html")) {
    return "<!-- page content not recorded -->";
  }

  const tld = domain.split(".").at(-1) ?? domain;
  const keep_lines = (keep: (line: string) => boolean, sample: number) => {
    const entries = body
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !/^(#|\/\/)/.test(line));
    const kept = entries.filter((line, index) => index < sample || keep(line));
    return `${kept.join("\n")}\n`;
  };

  if (url === "https://publicsuffix.org/list/public_suffix_list.dat") {
    return keep_lines((rule) => rule === tld || domain.endsWith(`.${rule}`), 0);
  }
  if (
    url.startsWith("https://raw.githubusercontent.com/hagezi/") ||
    url.startsWith("https://disposable.github.io/")
  ) {
    return keep_lines((entry) => entry === domain, 20);
  }
  if (url === "https://data.iana.org/rdap/dns.json") {
    const bootstrap = JSON.parse(body) as {
      services: [string[], string[]][];
    };
    bootstrap.services = bootstrap.services.filter(([tlds]) =>
      tlds.includes(tld),
    );
    return JSON.stringify(bootstrap);
  }
  return body;
}

test("record the scenario", async ({ page, context }) => {
  test.setTimeout(10 * 60_000);

  const scenario: Scenario = {
    domain,
    recorded_at: new Date().toISOString(),
    dnssec: { authenticated: false },
    responses: {},
  };

  await record(context, scenario);
  await page.goto(`/en/#${domain}`);
  await wait_for_results(page, live_timeout);
  await network_quiet();
  await context.unrouteAll({ behavior: "ignoreErrors" });

  const extension = await launch_extension();
  try {
    await record(extension, scenario);
    const id = await extension_id_of(extension);
    const popup = await extension.newPage();
    await popup.goto(`chrome-extension://${id}/popup.html?q=${domain}`);
    await wait_for_results(popup, live_timeout);
    await network_quiet();
    await extension.unrouteAll({ behavior: "ignoreErrors" });
  } finally {
    await extension.close();
  }

  const failed = Object.entries(scenario.responses)
    .filter(([, recorded]) => recorded?.failed === true)
    .map(([key]) => key);
  if (failed.length > 0) {
    console.warn(
      `Recorded as network failures (replayed as failures): ${failed.join(", ")}`,
    );
  }
  save_scenario(scenario);
});
