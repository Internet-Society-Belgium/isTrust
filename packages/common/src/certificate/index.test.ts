import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    type: [
      {
        value: "DV",
        verification: {
          by: {
            country: "FR",
            organization: "Gandi",
          },
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
          by: {
            country: "GB",
            organization: "Sectigo Limited",
          },
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "Internet Corporation For Assigned Names and Numbers",
        verification: {
          by: {
            country: "GB",
            organization: "Sectigo Limited",
          },
          status: "verified",
        },
      },
    ],
    type: [
      {
        value: "OV",
        verification: {
          by: {
            country: "GB",
            organization: "Sectigo Limited",
          },
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          by: {
            country: "US",
            organization: "Amazon",
          },
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          by: {
            country: "US",
            organization: "Let's Encrypt",
          },
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
          by: {
            country: "GB",
            organization: "COMODO CA Limited",
          },
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "US",
        verification: {
          by: {
            country: "GB",
            organization: "COMODO CA Limited",
          },
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "World Bank Group",
        verification: {
          by: {
            country: "GB",
            organization: "COMODO CA Limited",
          },
          status: "verified",
        },
      },
    ],
    type: [
      {
        value: "EV",
        verification: {
          by: {
            country: "GB",
            organization: "COMODO CA Limited",
          },
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          by: {
            country: "US",
            organization: "Amazon",
          },
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          by: {
            country: "US",
            organization: "Google Trust Services",
          },
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
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "Internet Corporation for Assigned Names and Numbers",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
      {
        value: "Internet Corporation for Assigned Names and Numbers",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
    ],
    type: [
      {
        value: "OV",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
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
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "US",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "DigiCert, Inc.",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
    ],
    type: [
      {
        value: "EV",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
          status: "verified",
        },
      },
      {
        value: "OV",
        verification: {
          by: {
            country: "US",
            organization: "DigiCert Inc",
          },
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
          by: {
            country: "BR",
            organization: "ICP-Brasil",
          },
          status: "verified",
        },
      },
    ],
    countries: [
      {
        value: "BR",
        verification: {
          by: {
            country: "BR",
            organization: "ICP-Brasil",
          },
          status: "verified",
        },
      },
    ],
    organizations: [
      {
        value: "GOOGLE PAY BRASIL INSTITUICAO DE PAGAMENTO LTDA",
        verification: {
          by: {
            country: "BR",
            organization: "ICP-Brasil",
          },
          status: "verified",
        },
      },
    ],
    type: [
      {
        value: "OV",
        verification: {
          by: {
            country: "BR",
            organization: "ICP-Brasil",
          },
          status: "verified",
        },
      },
      {
        value: "DV",
        verification: {
          by: {
            country: "US",
            organization: "Google Trust Services",
          },
          status: "verified",
        },
      },
    ],
  } satisfies typeof data);
});
