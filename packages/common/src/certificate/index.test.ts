import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    countries: [],
    individuals: [],
    organizations: [],
    types: [
      {
        value: "DV",
        verification: {
          verified: true,
        },
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

test("digicert.com", async () => {
  const data = await get_data("digicert.com");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
        verification: {
          verified: true,
        },
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
        verification: {
          verified: true,
        },
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
        verification: {
          verified: true,
        },
        sources: [
          {
            country: "US",
            links: [],
            organization: "DigiCert Inc",
          },
        ],
      },
      {
        value: "OV",
        verification: {
          verified: true,
        },
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
  const data = await get_data("google.com");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "BR",
        verification: {
          verified: true,
        },
        sources: [
          {
            country: "BR",
            links: [],
            organization: "ICP-Brasil",
          },
        ],
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "GOOGLE PAY BRASIL INSTITUICAO DE PAGAMENTO LTDA",
        verification: {
          verified: true,
        },
        sources: [
          {
            country: "BR",
            links: [],
            organization: "ICP-Brasil",
          },
        ],
      },
    ],
    types: [
      {
        value: "OV",
        verification: {
          verified: true,
        },
        sources: [
          {
            country: "BR",
            links: [],
            organization: "ICP-Brasil",
          },
        ],
      },
      {
        value: "DV",
        verification: {
          verified: true,
        },
        sources: [
          {
            country: "US",
            links: [],
            organization: "Google Trust Services",
          },
        ],
      },
    ],
  } satisfies typeof data);
});
