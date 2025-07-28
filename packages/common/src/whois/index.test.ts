import { expect, test } from "vitest";
import { get_data } from ".";
import { DataCache } from "../type";

/* eslint-disable @typescript-eslint/require-await */
let storePsl: Record<string, string> = {};
let storeRdap: Record<string, string> = {};
const cache: DataCache = {
  psl: {
    set: async (key: string, value: string) => {
      storePsl[key] = value;
    },
    get: async (key: string) => storePsl[key] ?? null,
    clear: async () => {
      storePsl = {};
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      storeRdap[key] = value;
    },
    get: async (key: string) => storeRdap[key] ?? null,
    clear: async () => {
      storeRdap = {};
    },
  },
};

test("wikipedia.org", async () => {
  const whoisData = await get_data("wikipedia.org", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        value: "US",
        verification: {
          authorities: [
            {
              country: null,
              links: [],
              organization: "MarkMonitor Inc.",
            },
          ],
          status: "unverified",
        },
      },
    ],
    expirations: [
      {
        value: "2026-01-12T23:00:00.000Z",
        verification: {
          authorities: [
            {
              country: null,
              links: [],
              organization: "MarkMonitor Inc.",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: null,
    organizations: [
      {
        value: "Wikimedia Foundation, Inc.",
        verification: {
          authorities: [
            {
              country: null,
              links: [],
              organization: "MarkMonitor Inc.",
            },
          ],
          status: "unverified",
        },
      },
    ],
    registrations: [
      {
        value: "2001-01-12T23:00:00.000Z",
        verification: {
          authorities: [
            {
              country: null,
              links: [],
              organization: "MarkMonitor Inc.",
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof whoisData);
});

test("istrust.org", async () => {
  const whoisData = await get_data("istrust.org", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        value: "BE",
        verification: {
          authorities: [
            {
              links: [
                "https://rdap.publicinterestregistry.org/rdap/entity/81",
                "https://www.gandi.net/",
              ],
              organization: "Gandi SAS",
              country: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    expirations: [
      {
        value: "2025-09-06T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: [
                "https://rdap.publicinterestregistry.org/rdap/entity/81",
                "https://www.gandi.net/",
              ],
              organization: "Gandi SAS",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [
      {
        value: "Redacted for Privacy",
        verification: {
          authorities: [
            {
              links: ["https://www.gandi.net/"],
              organization: "Gandi SAS",
              country: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    organizations: [
      {
        value: "Internet Society Chapter Belgium vzw/asbl",
        verification: {
          authorities: [
            {
              links: [
                "https://rdap.publicinterestregistry.org/rdap/entity/81",
                "https://www.gandi.net/",
              ],
              organization: "Gandi SAS",
              country: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    registrations: [
      {
        value: "2021-09-06T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: [
                "https://rdap.publicinterestregistry.org/rdap/entity/81",
                "https://www.gandi.net/",
              ],
              organization: "Gandi SAS",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof whoisData);
});

test("newtab.com", async () => {
  const whoisData = await get_data("newtab.com", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        value: "CN",
        verification: {
          authorities: [
            {
              organization:
                "Alibaba Cloud Computing Ltd. d/b/a HiChina (www.net.cn)",
              country: null,
              links: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    expirations: [
      {
        value: "2029-04-23T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: ["http://wanwang.aliyun.com"],
              organization:
                "Alibaba Cloud Computing Ltd. d/b/a HiChina (www.net.cn)",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [
      {
        value: "Redacted for Privacy",
        verification: {
          authorities: [
            {
              organization:
                "Alibaba Cloud Computing Ltd. d/b/a HiChina (www.net.cn)",
              country: null,
              links: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    organizations: [
      {
        value: "广西云奥网络科技有限公司",
        verification: {
          authorities: [
            {
              organization:
                "Alibaba Cloud Computing Ltd. d/b/a HiChina (www.net.cn)",
              country: null,
              links: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    registrations: [
      {
        value: "2005-04-23T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: ["http://wanwang.aliyun.com"],
              organization:
                "Alibaba Cloud Computing Ltd. d/b/a HiChina (www.net.cn)",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof whoisData);
});

test("phishurl.com", async () => {
  const whoisData = await get_data("phishurl.com", cache);

  expect(whoisData).toStrictEqual({
    countries: [
      {
        value: "BE",
        verification: {
          authorities: [
            {
              links: ["https://rdap.ovh.com/"],
              organization: "OVH, SAS",
              country: null,
            },
          ],
          status: "unverified",
        },
      },
    ],
    expirations: [
      {
        value: "2025-05-26T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: ["http://www.ovh.com", "https://rdap.ovh.com/"],
              organization: "OVH sas",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: null,
    organizations: null,
    registrations: [
      {
        value: "2024-05-26T22:00:00.000Z",
        verification: {
          authorities: [
            {
              links: ["http://www.ovh.com", "https://rdap.ovh.com/"],
              organization: "OVH sas",
              country: null,
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof whoisData);
});
