import { describe, expect, test } from "vitest";
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

describe("improve_data countries", () => {
  test("proxy service registrant keeps its country", () => {
    const data = run(fixtures.NAMECHEAP);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "NAMECHEAP INC", links: [] }],
        meta: [
          {
            role: "office",
            owner: "Privacy service provided by WITHHELD FOR PRIVACY LLC",
          },
        ],
      },
    ]);
  });

  test("owner country", () => {
    const data = run(fixtures.BANKOFAMERICA);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "CSC Corporate Domains, Inc.", links: [] }],
        meta: [{ role: "office", owner: "Bank of America Corporation" }],
      },
    ]);
  });

  test("Belgian owner", () => {
    const data = run(fixtures.ISTRUST);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["BE"]);
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Internet Society Chapter Belgium vzw/asbl",
    ]);
  });

  test("registrant without name or organization keeps country, no owner", () => {
    const data = run(fixtures.GITHUB);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
    expect(data.countries[0]?.meta).toStrictEqual([{ role: "office" }]);
    expect(data.organizations).toStrictEqual([]);
  });

  test("placeholder cc is dropped", () => {
    const data = run(fixtures.CC_REDACTED);

    expect(data.countries).toStrictEqual([]);
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Bank of America Corporation",
    ]);
  });

  test("country name in address label is normalized", () => {
    const data = run(fixtures.LABEL_UNITED_STATES);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
  });
});

// In-memory cache, seeded with the whois-proxy pattern that matches namecheap
// in the published list, and marked fresh so nothing is fetched.
function seeded_cache(): InformationCache {
  const entries = new Map<string, string>([
    [
      "whois_proxy",
      JSON.stringify([
        "^Privacy service provided by WITHHELD FOR PRIVACY LLC$",
      ]),
    ],
    ["whois_proxy#lastUpdate", new Date().toISOString()],
  ]);

  return {
    get: (key) => Promise.resolve(entries.get(key)),
    set: (key, value) => {
      entries.set(key, value);
      return Promise.resolve();
    },
    clear: (prefix) => {
      for (const key of [...entries.keys()]) {
        if (key.startsWith(prefix)) entries.delete(key);
      }
      return Promise.resolve();
    },
  };
}

describe("is_proxy_owner", () => {
  test.each([
    ["namecheap", fixtures.NAMECHEAP, true],
    ["bankofamerica", fixtures.BANKOFAMERICA, false],
    // The organization is checked, not the redacted name.
    ["istrust", fixtures.ISTRUST, false],
    ["github, no owner", fixtures.GITHUB, false],
  ])("%s", async (_, fixture, expected) => {
    expect(await is_proxy_owner(run(fixture), seeded_cache())).toBe(expected);
  });
});
