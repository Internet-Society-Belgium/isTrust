import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    types: [
      {
        value: "DV",
        verification: {
          authorities: [
            {
              country: "FR",
              organization: "Gandi",
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
              organization: "Sectigo Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "Internet Corporation For Assigned Names and Numbers",
        verification: {
          authorities: [
            {
              country: "GB",
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
              organization: "Amazon",
            },
            {
              country: "US",
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
    businessCategories: [
      {
        value: "Non-Commercial Entity",
        verification: {
          authorities: [
            {
              country: "GB",
              organization: "COMODO CA Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "US",
        verification: {
          authorities: [
            {
              country: "GB",
              organization: "COMODO CA Limited",
            },
          ],
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "World Bank Group",
        verification: {
          authorities: [
            {
              country: "GB",
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
              organization: "Amazon",
            },
            {
              country: "US",
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
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "Internet Corporation for Assigned Names and Numbers",
        verification: {
          authorities: [
            {
              country: "US",
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
    businessCategories: [
      {
        value: "Private Organization",
        verification: {
          authorities: [
            {
              country: "US",
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "US",
        verification: {
          authorities: [
            {
              country: "US",
              organization: "DigiCert Inc",
            },
          ],
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "DigiCert, Inc.",
        verification: {
          authorities: [
            {
              country: "US",
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
    businessCategories: [
      {
        value: "Private Organization",
        verification: {
          authorities: [
            {
              country: "BR",
              organization: "ICP-Brasil",
            },
          ],
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "BR",
        verification: {
          authorities: [
            {
              country: "BR",
              organization: "ICP-Brasil",
            },
          ],
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "GOOGLE PAY BRASIL INSTITUICAO DE PAGAMENTO LTDA",
        verification: {
          authorities: [
            {
              country: "BR",
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
              organization: "Google Trust Services",
            },
          ],
          status: "verified",
        },
      },
    ],
  } satisfies typeof data);
});
