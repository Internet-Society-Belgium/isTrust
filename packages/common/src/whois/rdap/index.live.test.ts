import { expect, test } from "vitest";
import { get_data } from ".";
import { InformationCache } from "../../type";

/* eslint-disable @typescript-eslint/require-await */
let store: Record<string, string> = {};
const cache: InformationCache = {
  set: async (key: string, value: string) => {
    store[key] = value;
  },
  get: async (key: string) => store[key],
  clear: async () => {
    store = {};
  },
};

test("istrust.org", async () => {
  const data = await get_data("istrust.org", cache);

  expect(data).toStrictEqual({
    countries: [
      {
        value: "BE",
        meta: ["office"],
        verified: false,
        sources: [
          {
            links: ["https://www.gandi.net/"],
            organization: "Gandi SAS",
          },
        ],
      },
    ],
    individuals: [
      {
        value: "Redacted for Privacy",
        verified: false,
        sources: [
          {
            links: ["https://www.gandi.net/"],
            organization: "Gandi SAS",
          },
        ],
      },
    ],
    organizations: [
      {
        value: "Internet Society Chapter Belgium vzw/asbl",
        verified: false,
        sources: [
          {
            links: ["https://www.gandi.net/"],
            organization: "Gandi SAS",
          },
        ],
      },
    ],
    registrations: [
      {
        value: "2021-09-07T00:00:00.000Z",
        sources: [
          {
            links: ["https://www.gandi.net/"],
            organization: "Gandi SAS",
          },
        ],
      },
    ],
  } satisfies typeof data);
});

test("github.com", async () => {
  const data = await get_data("github.com", cache);

  expect(data).toStrictEqual({
    countries: [
      {
        sources: [
          {
            country: "US",
            links: ["https://www.markmonitor.com/about-us/"],
            organization: "Markmonitor Inc.",
          },
        ],
        value: "US",
        meta: ["office"],
        verified: false,
      },
    ],
    // MarkMonitor's RDAP now redacts the registrant ("REDACTED FOR PRIVACY",
    // empty name, no organization), so none is reported.
    individuals: [],
    organizations: [],
    registrations: [
      {
        sources: [
          {
            country: "US",
            links: [
              "http://www.markmonitor.com",
              "https://www.markmonitor.com/about-us/",
            ],
            organization: "MarkMonitor Inc.",
          },
        ],
        value: "2007-10-09T00:00:00.000Z",
      },
    ],
  } satisfies typeof data);
});
