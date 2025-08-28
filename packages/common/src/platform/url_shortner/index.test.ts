import { expect, test } from "vitest";
import { get_data } from ".";
import { InformationCache } from "../../type";

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

test("bit.ly", async () => {
  const data = await get_data("bit.ly", cache);

  expect(data).toStrictEqual({
    platforms: [
      {
        sources: [
          {
            links: ["https://github.com/hagezi/dns-blocklists"],
            organization: "HaGeZi's Blocklist URL Shortener",
          },
        ],
        value: "url_shortner",
      },
    ],
  } satisfies typeof data);
});
