import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const dnssec = await get_data("istrust.org");

  expect(dnssec).toStrictEqual({
    valid: {
      sources: [
        {
          country: "CH",
          links: ["https://quad9.net/"],
          organization: "Quad9",
        },
      ],
      value: false,
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
          country: "CH",
          links: ["https://quad9.net/"],
          organization: "Quad9",
        },
      ],
      verified: true,
    },
  } satisfies typeof dnssec);
});
