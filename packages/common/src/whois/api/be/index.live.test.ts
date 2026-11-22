import { expect, test } from "vitest";
import { get_data } from ".";

test("dnsbelgium.be", async () => {
  const data = await get_data("dnsbelgium.be", true);

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
      },
    ],
  } satisfies typeof data);
});

test("internetsociety.be", async () => {
  const data = await get_data("internetsociety.be", true);

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
        verified: false,
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
        value: "Internet Society Chapter Belgium vzw/asbl",
        verified: false,
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
        value: "2006-04-21T00:00:00.000Z",
      },
    ],
  } satisfies typeof data);
});
