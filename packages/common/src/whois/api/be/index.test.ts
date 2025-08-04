import { expect, test } from "vitest";
import { get_data } from ".";

test("dnsbelgium.be", async () => {
  const whoisData = await get_data("dnsbelgium.be");

  expect(whoisData).toStrictEqual({
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
        verification: {
          since: "2025-06-12T09:34:43.446Z",
          verified: true,
        },
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
        verification: {
          since: "2025-06-12T09:34:43.446Z",
          verified: true,
        },
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
        value: "2012-06-13T14:23:47.000Z",
      },
    ],
  } satisfies typeof whoisData);
});
