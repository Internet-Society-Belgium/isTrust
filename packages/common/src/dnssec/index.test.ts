import { expect, test } from "vitest";
import { get_data } from ".";

test("wikipedia.org", async () => {
  const dnssec = await get_data("wikipedia.org");

  expect(dnssec).toStrictEqual({
    valid: {
      value: false,
      verification: {
        authorities: [
          {
            country: "US",
            links: ["https://one.one.one.one/dns/"],
            organization: "Cloudflare",
          },
        ],
        status: "verified",
      },
    },
  } satisfies typeof dnssec);
});

test("internetsociety.org", async () => {
  const dnssec = await get_data("internetsociety.org");

  expect(dnssec).toStrictEqual({
    valid: {
      value: true,
      verification: {
        authorities: [
          {
            country: "US",
            links: ["https://one.one.one.one/dns/"],
            organization: "Cloudflare",
          },
        ],
        status: "verified",
      },
    },
  } satisfies typeof dnssec);
});
