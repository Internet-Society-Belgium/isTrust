import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const dnssec = await get_data("istrust.org");

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
      verified: true,
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
      verified: true,
    },
  } satisfies typeof dnssec);
});
