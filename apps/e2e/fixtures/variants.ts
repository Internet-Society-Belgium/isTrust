import { response_key, type Scenario } from "./scenario";

// Variants of a recorded scenario, for the alerts a safe domain never shows.
// Select one with `test.use({ variant: "alerts" })`.

const quad9 = (domain: string) =>
  response_key("GET", `https://api.quad9.net/search/${domain}`);
const url_shorteners = response_key(
  "GET",
  "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/urlshortener-onlydomains.txt",
);

function with_response(
  scenario: Scenario,
  key: string,
  change: (body: string) => string,
): Scenario {
  const recorded = scenario.responses[key];
  if (recorded === undefined) {
    throw new Error(
      `No recorded response for ${key}: record the scenario again`,
    );
  }
  if (recorded.failed === true) {
    throw new Error(
      `${key} failed when it was recorded, so it has no body to change: record the scenario again (npm run record:e2e)`,
    );
  }
  return {
    ...scenario,
    responses: {
      ...scenario.responses,
      [key]: { ...recorded, body: change(recorded.body) },
    },
  };
}

export const variants = {
  recorded: (scenario: Scenario) => scenario,

  // The DoH resolvers validate the domain with DNSSEC.
  dnssec: (scenario: Scenario): Scenario => ({
    ...scenario,
    dnssec: { authenticated: true },
  }),

  // Listed as malicious by Quad9, listed as a URL shortener, and without
  // DNSSEC validation.
  alerts: (scenario: Scenario): Scenario => {
    let changed = with_response(scenario, quad9(scenario.domain), (body) =>
      JSON.stringify({ ...(JSON.parse(body) as object), blocked: true }),
    );
    changed = with_response(
      changed,
      url_shorteners,
      (body) => `${body}${scenario.domain}\n`,
    );
    return { ...changed, dnssec: { authenticated: false } };
  },
} satisfies Record<string, (scenario: Scenario) => Scenario>;

export type Variant = keyof typeof variants;
