import { expect, test } from "vitest";
import { get_data } from ".";
import { InformationCache } from "../type";

/* eslint-disable @typescript-eslint/require-await */
let storePsl: Record<string, string> = {};
let storeRdap: Record<string, string> = {};
const cache: InformationCache = {
  psl: {
    set: async (key: string, value: string) => {
      storePsl[key] = value;
    },
    get: async (key: string) => storePsl[key],
    clear: async () => {
      storePsl = {};
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      storeRdap[key] = value;
    },
    get: async (key: string) => storeRdap[key],
    clear: async () => {
      storeRdap = {};
    },
  },
};

test("istrust.org", async () => {
  const whoisData = await get_data("istrust.org", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        value: "BE",
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
  } satisfies typeof whoisData);
});

test("github.com", async () => {
  const whoisData = await get_data("github.com", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        sources: [
          {
            country: "US",
            links: [],
            organization: "Markmonitor Inc.",
          },
        ],
        value: "US",
        verified: false,
      },
    ],
    individuals: [
      {
        sources: [
          {
            country: "US",
            links: [],
            organization: "Markmonitor Inc.",
          },
        ],
        value: "REDACTED REGISTRANT",
        verified: false,
      },
    ],
    organizations: [
      {
        sources: [
          {
            country: "US",
            links: [],
            organization: "Markmonitor Inc.",
          },
        ],
        value: "GitHub, Inc.",
        verified: false,
      },
    ],
    registrations: [
      {
        sources: [
          {
            country: "US",
            links: ["http://www.markmonitor.com"],
            organization: "MarkMonitor Inc.",
          },
        ],
        value: "2007-10-09T00:00:00.000Z",
      },
    ],
  } satisfies typeof whoisData);
});
