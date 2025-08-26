import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    blocked: {
      sources: [
        {
          country: "CH",
          links: ["https://quad9.net/service/threat-blocking/"],
          organization: "Quad9",
        },
      ],
      value: false,
      verified: true,
    },
  } satisfies typeof data);
});
