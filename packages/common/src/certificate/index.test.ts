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
          authorities: [
            {
              country: "FR",
              organization: "Gandi",
              links: [],
            },
          ],
          status: "verified",
        },
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
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "Sectigo Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "Internet Corporation For Assigned Names and Numbers",
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "Sectigo Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    types: [
      {
        value: "OV",
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "Sectigo Limited",
            },
          ],
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          authorities: [
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
          status: "verified",
        },
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
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "COMODO CA Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "World Bank Group",
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "COMODO CA Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    types: [
      {
        value: "EV",
        verification: {
          authorities: [
            {
              country: "GB",
              links: [],
              organization: "COMODO CA Limited",
            },
          ],
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          authorities: [
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
          status: "verified",
        },
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
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "Internet Corporation for Assigned Names and Numbers",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    types: [
      {
        value: "OV",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
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
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "DigiCert, Inc.",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    types: [
      {
        value: "EV",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
      {
        value: "OV",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
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
          authorities: [
            {
              country: "BR",
              links: [],
              organization: "ICP-Brasil",
            },
          ],
          status: "verified",
        },
      },
    ],
    individuals: [],
    organizations: [
      {
        value: "GOOGLE PAY BRASIL INSTITUICAO DE PAGAMENTO LTDA",
        verification: {
          authorities: [
            {
              country: "BR",
              links: [],
              organization: "ICP-Brasil",
            },
          ],
          status: "verified",
        },
      },
    ],
    types: [
      {
        value: "OV",
        verification: {
          authorities: [
            {
              country: "BR",
              links: [],
              organization: "ICP-Brasil",
            },
          ],
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          authorities: [
            {
              country: "US",
              links: [],
              organization: "Google Trust Services",
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof data);
});
