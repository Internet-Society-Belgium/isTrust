import { expect, test } from "vitest";
import { is_proxy } from ".";
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

test("isoc.org: Domains by Proxy, LLC", async () => {
  const proxy = await is_proxy("isoc.org", "Domains by Proxy, LLC", cache);

  expect(proxy).toStrictEqual(true);
});

test("www.domainsbyproxy.com: Domains by Proxy, LLC", async () => {
  const proxy = await is_proxy(
    "www.domainsbyproxy.com",
    "Domains by Proxy, LLC",
    cache,
  );

  expect(proxy).toStrictEqual(false);
});
