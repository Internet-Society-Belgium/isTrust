// `npm run record:e2e`: rewrites scenarios/<domain>.json from the real
// services. It runs the same flows as the tests (the website, and the
// extension, which calls more services because it can bypass CORS) and saves
// every response, trimmed so the file stays small. Review the diff before
// committing it: the expectations in the tests may need to follow.
import type { BrowserContext, Route } from "@playwright/test";
import { doh_authenticated, is_doh_request } from "../fixtures/doh";
import { handle_common_request } from "../fixtures/network";
import { seed_random } from "../fixtures/random";
import {
  record_failure,
  response_key,
  save_scenario,
  type RecordedResponse,
  type Scenario,
} from "../fixtures/scenario";
import {
  domain,
  expect,
  extension_id_of,
  launch_extension,
  live_timeout,
  test,
  wait_for_results,
} from "../fixtures/test";

const is_text = (content_type: string) =>
  /json|text|javascript|xml/.test(content_type);

/** One recording: the scenario it fills, and what its route handler tracks. */
interface Recording {
  scenario: Scenario;
  /** Requests in flight, to wait until the page stops calling services. */
  in_flight: number;
  /** DNSSEC flags of the DoH answers: they must agree. */
  dnssec_answers: boolean[];
}

async function network_quiet(recording: Recording): Promise<void> {
  let quiet_since = Date.now();
  while (Date.now() - quiet_since < 2_000) {
    if (recording.in_flight > 0) quiet_since = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function record(context: BrowserContext, recording: Recording) {
  await seed_random(context);
  await context.route("**/*", async (route) => {
    recording.in_flight++;
    try {
      await record_route(route, recording);
    } finally {
      recording.in_flight--;
    }
  });
}

async function record_route(route: Route, recording: Recording) {
  const { scenario } = recording;
  if (await handle_common_request(route, domain)) return;
  const request = route.request();
  const url = request.url();

  // A service that fails live fails in the browser too: the checks fall
  // back (e.g. to the next DoH resolver) as they would for a user.
  let response;
  let body;
  try {
    response = await route.fetch();
    body = await response.body();
  } catch {
    // DoH queries have no recorded answer, so only a GET failure is kept.
    if (request.method() === "GET" && !is_doh_request(request)) {
      record_failure(scenario, response_key("GET", url));
    }
    await route.abort().catch(() => undefined);
    return;
  }

  if (is_doh_request(request)) {
    if (response.ok()) recording.dnssec_answers.push(doh_authenticated(body));
  } else if (request.method() === "GET") {
    const content_type = response.headers()["content-type"] ?? "";
    const text = is_text(content_type);
    const recorded: RecordedResponse = {
      status: response.status(),
      content_type,
      body: text
        ? trim(url, content_type, body.toString("utf8"))
        : body.toString("base64"),
      ...(text ? {} : { base64: true }),
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
    // shortcut: keeps 20 entries plus the domain's own, not its parent or subdomains; keep those too before recording a domain with subdomains in the lists.
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

  const recording: Recording = {
    scenario: {
      domain,
      recorded_at: new Date().toISOString(),
      dnssec: { authenticated: false },
      responses: {},
    },
    in_flight: 0,
    dnssec_answers: [],
  };
  const { scenario, dnssec_answers } = recording;

  await record(context, recording);
  await page.goto(`/en/#${domain}`);
  await wait_for_results(page, live_timeout);
  await network_quiet(recording);
  await context.unrouteAll({ behavior: "ignoreErrors" });

  const extension = await launch_extension();
  try {
    await record(extension, recording);
    const id = await extension_id_of(extension);
    const popup = await extension.newPage();
    await popup.goto(`chrome-extension://${id}/popup.html?q=${domain}`);
    await wait_for_results(popup, live_timeout);
    await network_quiet(recording);
    await extension.unrouteAll({ behavior: "ignoreErrors" });
  } finally {
    await extension.close();
  }

  const failed = Object.entries(scenario.responses)
    .filter(([, recorded]) => recorded?.failed === true)
    .map(([key]) => key);
  expect(
    new Set(dnssec_answers).size,
    "DoH resolvers disagree on DNSSEC: rerun npm run record:e2e",
  ).toBeLessThanOrEqual(1);
  scenario.dnssec.authenticated = dnssec_answers.at(0) ?? false;
  expect(
    failed,
    "requests failed while recording: rerun npm run record:e2e",
  ).toEqual([]);
  save_scenario(scenario);
});
