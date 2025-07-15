import { expect, test } from "vitest";
import { get_data } from ".";
import { InternalCache } from "../type";

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
  const whoisData = await get_data("wikipedia.org", cache);

  expect(whoisData).toStrictEqual({
    registration: "2001-01-13T00:12:14.754Z",
    expiration: "2026-01-13T00:12:14.000Z",
    registrant: {
      organization: "Wikimedia Foundation, Inc.",
      country: {
        code: "US",
      },
    },
    dnssecPresent: false,
  } satisfies typeof whoisData);
});

test("istrust.org", async () => {
  const whoisData = await get_data("istrust.org", cache);

  expect(whoisData).toStrictEqual({
    registration: "2021-09-07T08:09:16.242Z",
    expiration: "2025-09-07T08:09:16.242Z",
    registrant: {
      organization: "Internet Society Chapter Belgium vzw/asbl",
      country: {
        code: "BE",
      },
    },
    dnssecPresent: false,
  } satisfies typeof whoisData);
});

test("newtab.com", async () => {
  const whoisData = await get_data("newtab.com", cache);

  expect(whoisData).toStrictEqual({
    dnssecPresent: false,
    expiration: "2029-04-24T00:12:17.000Z",
    registrant: {
      country: {
        name: "CN",
      },
      individual: "Redacted for Privacy",
      organization: "广西云奥网络科技有限公司",
    },
    registration: "2005-04-24T00:12:17.000Z",
  } satisfies typeof whoisData);
});

test("phishurl.com", async () => {
  const whoisData = await get_data("phishurl.com", cache);

  expect(whoisData).toStrictEqual({
    dnssecPresent: false,
    expiration: "2025-05-27T15:31:15.000Z",
    registrant: {
      country: {
        code: "BE",
      },
    },
    registration: "2024-05-27T15:31:15.000Z",
  } satisfies typeof whoisData);
});
