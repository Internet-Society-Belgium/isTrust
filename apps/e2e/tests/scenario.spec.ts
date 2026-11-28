import { expect, test } from "@playwright/test";
import {
  record_failure,
  response_key,
  type Scenario,
} from "../fixtures/scenario";

const key = response_key("GET", "https://api.quad9.net/search/istrust.org");

const empty_scenario = (): Scenario => ({
  domain: "istrust.org",
  recorded_at: "2026-01-01T00:00:00.000Z",
  dnssec: { authenticated: false },
  responses: {},
});

test("records a failure when nothing is recorded yet", () => {
  const scenario = empty_scenario();
  record_failure(scenario, key);
  expect(scenario.responses[key]?.failed).toBe(true);
});

test("keeps a response an earlier pass recorded", () => {
  const scenario = empty_scenario();
  const recorded = { status: 200, contentType: "application/json", body: "{}" };
  scenario.responses[key] = recorded;
  record_failure(scenario, key);
  expect(scenario.responses[key]).toEqual(recorded);
});
