import { describe, expect, test } from "vitest";
import type { InformationCache } from "../../type";
import type { WHOISData } from "../type";
import * as fixtures from "./fixtures";
import { improve_data } from "./index";
import { validate_rdap_result } from "./type";

// In-memory cache, seeded so the whois_proxy list is considered fresh and
// nothing is fetched.
function seeded_cache(): InformationCache {
  const entries = new Map<string, string>([
    ["whois_proxy", JSON.stringify(["withheld for privacy"])],
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

async function run(fixture: unknown) {
  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };
  await improve_data(data, validate_rdap_result(fixture), seeded_cache());
  return data;
}

describe("improve_data countries", () => {
  test("privacy service country is marked as proxy", async () => {
    const data = await run(fixtures.NAMECHEAP);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "NAMECHEAP INC", links: [] }],
        proxy: true,
      },
    ]);
  });

  test("owner country is not a proxy and has no proxy key", async () => {
    const data = await run(fixtures.BANKOFAMERICA);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "CSC Corporate Domains, Inc.", links: [] }],
      },
    ]);
    expect(data.countries[0]).not.toHaveProperty("proxy");
  });

  test("Belgian owner is not a proxy", async () => {
    const data = await run(fixtures.ISTRUST);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["BE"]);
    expect(data.countries[0]).not.toHaveProperty("proxy");
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Internet Society Chapter Belgium vzw/asbl",
    ]);
  });

  test("registrant without name or organization keeps country, no owner", async () => {
    const data = await run(fixtures.GITHUB);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
    expect(data.countries[0]).not.toHaveProperty("proxy");
    expect(data.organizations).toStrictEqual([]);
  });

  test("placeholder cc is dropped", async () => {
    const data = await run(fixtures.CC_REDACTED);

    expect(data.countries).toStrictEqual([]);
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Bank of America Corporation",
    ]);
  });

  test("country name in address label is normalized", async () => {
    const data = await run(fixtures.LABEL_UNITED_STATES);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
  });
});
