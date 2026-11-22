import { expect, test } from "vitest";
import { get_effective_domain } from ".";
import { InformationCache } from "../type";

/* eslint-disable @typescript-eslint/require-await */
let store: Record<string, string> = {};
const cache: InformationCache = {
  set: async (key: string, value: string) => {
    store[key] = value;
  },
  get: async (key: string) => store[key],
  clear: async () => {
    store = {};
  },
};

test("en.wikipedia.org", async () => {
  const eDomain = await get_effective_domain("en.wikipedia.org", cache);

  expect(eDomain).toStrictEqual("wikipedia.org");
});

test("d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com", async () => {
  const eDomain = await get_effective_domain(
    "d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com",
    cache,
  );

  expect(eDomain).toStrictEqual(
    "d-5bnjadnof8.execute-api.eu-west-3.amazonaws.com",
  );
});
