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
  const data = await get_data("icann.org");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
        verified: true,
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "Internet Corporation For Assigned Names and Numbers",
        verified: true,
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
      },
    ],
    types: [
      {
        value: "OV",
        verified: true,
        sources: [
          {
            country: "GB",
            links: [],
            organization: "Sectigo Limited",
          },
        ],
      },
      {
        value: "DV",
        verified: true,
        sources: [
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
        ],
      },
    ],
  } satisfies typeof data);
});

test("worldbank.org", async () => {
  const data = await get_data("worldbank.org");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
        verified: true,
        sources: [
          {
            country: "GB",
            links: [],
            organization: "COMODO CA Limited",
          },
        ],
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "World Bank Group",
        verified: true,
        sources: [
          {
            country: "GB",
            links: [],
            organization: "COMODO CA Limited",
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
            country: "GB",
            links: [],
            organization: "COMODO CA Limited",
          },
        ],
      },
      {
        value: "DV",
        verified: true,
        sources: [
          {
            country: "US",
            links: [],
            organization: "Amazon",
          },
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

test("example.com", async () => {
  const data = await get_data("example.com");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
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
        value: "Internet Corporation for Assigned Names and Numbers",
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
        value: "OV",
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

test("digicert.com", async () => {
  const data = await get_data("digicert.com");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "US",
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
      {
        value: "OV",
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
  const data = await get_data("google.com");

  expect(data).toStrictEqual({
    countries: [
      {
        value: "BR",
        verified: true,
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
        verified: true,
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
        verified: true,
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
        verified: true,
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
