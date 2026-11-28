import { expect, test } from "vitest";
import { get_data } from ".";
import { Source } from "../type";

test("istrust.org", async () => {
  const data = await get_data("istrust.org", true);

  expect(data).toStrictEqual({
    countries: [],
    individuals: [],
    organizations: [],
    types: [
      {
        value: "DV",
        verified: true,
        sources: [
          {
            country: "FR",
            organization: "Gandi",
            links: [],
          },
        ],
      },
    ],
  } satisfies typeof data);
});

test("icann.org", async () => {
  const data = await get_data("icann.org", true);

  expect(data).toStrictEqual({
    countries: [
      {
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
        value: "US",
        meta: ["office"],
        verified: true,
      },
    ],
    individuals: [],
    organizations: [
      {
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
        value: "Internet Corporation For Assigned Names and Numbers",
        verified: true,
      },
    ],
    types: [
      {
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
        value: "OV",
        verified: true,
      },
      {
        // icann.org has DV certificates from several issuers. Which ones a
        // data source returns, and in what order, depends on the source.
        sources: expect.arrayContaining([
          {
            country: "US",
            links: [],
            organization: "Amazon",
          },
          {
            country: "US",
            links: [],
            organization: "Let's Encrypt",
          },
        ]) as Source[],
        value: "DV",
        verified: true,
      },
    ],
  } satisfies typeof data);
});

test("digicert.com", async () => {
  const data = await get_data("digicert.com", true);

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
        meta: ["office", "incorporated"],
        verified: true,
        sources: [
          {
            country: "US",
            links: [],
            organization: "DigiCert Inc",
          },
        ],
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "DigiCert, Inc.",
        verified: true,
        sources: [
          {
            country: "US",
            links: [],
            organization: "DigiCert Inc",
          },
        ],
      },
    ],
    types: [
      {
        value: "EV",
        verified: true,
        sources: [
          {
            country: "US",
            links: [],
            organization: "DigiCert Inc",
          },
        ],
      },
    ],
  } satisfies typeof data);
});

test("google.com", async () => {
  const data = await get_data("google.com", true);

  expect(data).toStrictEqual({
    countries: [],
    individuals: [],
    organizations: [],
    types: [
      {
        sources: [
          {
            country: "US",
            links: [],
            organization: "Google Trust Services",
          },
        ],
        value: "DV",
        verified: true,
      },
    ],
  } satisfies typeof data);
});
