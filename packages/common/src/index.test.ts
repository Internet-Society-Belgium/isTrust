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
    flush: async () => {
      storePsl = {};
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      storeRdap[key] = value;
    },
    get: async (key: string) => storeRdap[key] ?? null,
    flush: async () => {
      storeRdap = {};
    },
  },
};

test("en.wikipedia.org", async () => {
  const whoisData = await whois("en.wikipedia.org", cache);

  expect(whoisData).toStrictEqual({
    domain: "wikipedia.org",
  } satisfies typeof whoisData);
});

test("istrust.org", async () => {
  const whoisData = await whois("istrust.org", cache);

  expect(whoisData).toStrictEqual({
    domain: "istrust.org",
  } satisfies typeof whoisData);
});

test("d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com", async () => {
  const whoisData = await whois(
    "d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com",
    cache,
  );

  expect(whoisData).toStrictEqual({
    domain: "d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com",
  } satisfies typeof whoisData);
});

test("sub.sub.domain.compute.amazonaws.com", async () => {
  const whoisData = await whois("sub.sub.domain.compute.amazonaws.com", cache);

  expect(whoisData).toStrictEqual({
    domain: "sub.domain.compute.amazonaws.com",
  } satisfies typeof whoisData);
});
