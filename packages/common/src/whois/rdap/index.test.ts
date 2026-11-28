import { expect, test } from "vitest";
import type { InformationCache } from "../../type";
import { is_proxy_owner } from "../../whois_proxy";
import type { WHOISData } from "../type";
import * as fixtures from "./fixtures";
import { improve_data } from "./index";
import { validate_rdap_result } from "./type";

function run(fixture: unknown) {
  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };
  improve_data(data, validate_rdap_result(fixture));
  return data;
}

test.each([
  ["namecheap", fixtures.NAMECHEAP, ["US"]],
  ["bankofamerica", fixtures.BANKOFAMERICA, ["US"]],
  ["istrust", fixtures.ISTRUST, ["BE"]],
  ["github, no owner", fixtures.GITHUB, ["US"]],
  ["placeholder cc is dropped", fixtures.CC_REDACTED, []],
  ["country name in the label", fixtures.LABEL_UNITED_STATES, ["US"]],
])("improve_data countries: %s", (_, fixture, expected) => {
  expect(run(fixture).countries.map((c) => c.value)).toStrictEqual(expected);
});

// Seeded with the published whois-proxy pattern for namecheap, and marked
// fresh so nothing is fetched.
const store = new Map([
  [
    "whois_proxy",
    JSON.stringify(["^Privacy service provided by WITHHELD FOR PRIVACY LLC$"]),
  ],
  ["whois_proxy#lastUpdate", new Date().toISOString()],
]);
const cache: InformationCache = {
  get: (key) => Promise.resolve(store.get(key)),
  set: (key, value) => {
    store.set(key, value);
    return Promise.resolve();
  },
  clear: () => Promise.resolve(),
};

test.each([
  ["namecheap", fixtures.NAMECHEAP, true],
  ["bankofamerica", fixtures.BANKOFAMERICA, false],
  // The organization is checked, not the redacted name.
  ["istrust", fixtures.ISTRUST, false],
  ["github, no owner", fixtures.GITHUB, false],
])("is_proxy_owner: %s", async (_, fixture, expected) => {
  expect(await is_proxy_owner(run(fixture), cache)).toBe(expected);
});
