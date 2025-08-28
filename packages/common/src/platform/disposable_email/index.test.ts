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

test("istrust.org", async () => {
  const data = await get_data("istrust.org", cache);

  expect(data).toStrictEqual({
    platforms: [],
  } satisfies typeof data);
});

test("temp-mail.org", async () => {
  const data = await get_data("temp-mail.org", cache);

  expect(data).toStrictEqual({
    platforms: [
      {
        sources: [
          {
            links: ["https://github.com/disposable/disposable"],
            organization: "Disposable email domains",
          },
        ],
        value: "disposable_email",
      },
    ],
  } satisfies typeof data);
});
