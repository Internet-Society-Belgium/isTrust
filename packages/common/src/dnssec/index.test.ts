import { expect, test } from "vitest";
import { get_data } from ".";

test("wikipedia.org", async () => {
  const dnssec = await get_data("wikipedia.org");

  expect(dnssec).toStrictEqual({
    valid: {
      value: false,
      sources: [
        {
          country: "US",
          links: ["https://one.one.one.one/dns/"],
          organization: "Cloudflare",
        },
      ],
    },
  } satisfies typeof dnssec);
});

test("internetsociety.org", async () => {
  const dnssec = await get_data("internetsociety.org");

  expect(dnssec).toStrictEqual({
    valid: {
      value: true,
      sources: [
        {
          country: "US",
          links: ["https://one.one.one.one/dns/"],
          organization: "Cloudflare",
        },
      ],
    },
  } satisfies typeof dnssec);
});
