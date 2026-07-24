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

test(" Domains by Proxy, LLC ", async () => {
  const proxy = await is_proxy(" Domains by Proxy, LLC ", cache);

  expect(proxy).toStrictEqual(true);
});

test("Registrant of domain.tld", async () => {
  const proxy = await is_proxy("Registrant of domain.tld", cache);

  expect(proxy).toStrictEqual(true);
});

test("Privacy Hero Inc.", async () => {
  const proxy = await is_proxy("Privacy Hero Inc.", cache);

  expect(proxy).toStrictEqual(true);
});

test("Privacy Hero Inc", async () => {
  const proxy = await is_proxy("Privacy Hero Inc", cache);

  expect(proxy).toStrictEqual(false);
});
