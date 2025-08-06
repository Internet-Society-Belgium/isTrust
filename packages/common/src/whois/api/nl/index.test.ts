import { expect, test } from "vitest";
import { get_data } from ".";

test("sidn.nl", async () => {
  const whoisData = await get_data("sidn.nl");

  expect(whoisData).toStrictEqual({
    countries: [],
    individuals: [],
    organizations: [
      {
        sources: [
          {
            country: "NL",
            links: ["https://www.sidn.nl/"],
            organization: "SIDN BV",
          },
        ],
        value: "Stichting Internet Domeinregistratie Nederland",
      },
    ],
    registrations: [
      {
        sources: [
          {
            country: "NL",
            links: ["https://www.sidn.nl/"],
            organization: "SIDN BV",
          },
        ],
        value: "1999-11-18T00:00:00.000Z",
      },
    ],
  } satisfies typeof whoisData);
});
