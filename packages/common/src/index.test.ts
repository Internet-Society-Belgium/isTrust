import { expect, test } from "vitest";
import { InternalCache, whois } from ".";

let storePsl: Record<string, string> = {};
let storeRdap: Record<string, string> = {};
const cache: InternalCache = {
  psl: {
    set: async (key: string, value: string) => {
      storePsl[key] = value;
    },
    get: async (key: string) => storePsl[key] ?? null,
    clear: async () => {
      storePsl = {};
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      storeRdap[key] = value;
    },
    get: async (key: string) => storeRdap[key] ?? null,
    clear: async () => {
      storeRdap = {};
    },
  },
};

test("wikipedia.org", async () => {
  const whoisData = await whois("wikipedia.org", cache);

  expect(whoisData).toStrictEqual({
    domain: "wikipedia.org",
    registration: "2001-01-13T00:12:14.754Z",
    registrant: {
      organization: "Wikimedia Foundation, Inc.",
      country: "US",
    },
    dnssecPresent: false,
  } satisfies typeof whoisData);
});

test("istrust.org", async () => {
  const whoisData = await whois("istrust.org", cache);

  expect(whoisData).toStrictEqual({
    domain: "istrust.org",
    registration: "2021-09-07T08:09:16.242Z",
    registrant: {
      organization: "Internet Society Chapter Belgium vzw/asbl",
      country: "BE",
    },
    dnssecPresent: false,
  } satisfies typeof whoisData);
});
