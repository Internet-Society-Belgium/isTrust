import { expect, test } from "vitest";
import { get_data } from ".";

test("dnsbelgium.be", async () => {
  const data = await get_data("dnsbelgium.be");

  expect(data).toStrictEqual({
    countries: [
      {
        sources: [
          {
            country: "BE",
            links: ["https://www.dnsbelgium.be/"],
            organization: "DNS Belgium",
          },
        ],
        value: "BE",
        verified: true,
      },
    ],
    individuals: [],
    organizations: [
      {
        sources: [
          {
            country: "BE",
            links: ["https://www.dnsbelgium.be/"],
            organization: "DNS Belgium",
          },
        ],
        value: "DNS Belgium vzw",
        verified: true,
      },
    ],
    registrations: [
      {
        sources: [
          {
            country: "BE",
            links: ["https://www.dnsbelgium.be/"],
            organization: "DNS Belgium",
          },
        ],
        value: "2012-06-13T00:00:00.000Z",
        verified: true,
      },
    ],
  } satisfies typeof data);
});
