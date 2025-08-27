import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org CORS", async () => {
  const data = await get_data("istrust.org", true);

  expect(data).toStrictEqual({
    valid: {
      sources: [
        {
          country: "CH",
          links: ["https://quad9.net/"],
          organization: "Quad9",
        },
      ],
      value: false,
    },
  } satisfies typeof data);
});

test("internetsociety.org", async () => {
  const data = await get_data("internetsociety.org");

  expect(data).toStrictEqual({
    valid: {
      sources: [
        {
          country: "US",
          links: ["https://one.one.one.one/dns/"],
          organization: "Cloudflare",
        },
      ],
      value: true,
    },
  } satisfies typeof data);
});
