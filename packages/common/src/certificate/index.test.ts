import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    types: [
      {
        value: "DV",
        verification: {
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
          authority: [
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
