import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    type: "DV",
  } satisfies typeof data);
});

test("icann.org", async () => {
  const data = await get_data("icann.org");

  expect(data).toStrictEqual({
    countryCode: "US",
    organisation: "Internet Corporation For Assigned Names and Numbers",
    type: "OV",
  } satisfies typeof data);
});

test("worldbank.org", async () => {
  const data = await get_data("worldbank.org");

  expect(data).toStrictEqual({
    businessCategory: "Non-Commercial Entity",
    countryCode: "US",
    incCountryCode: "US",
    organisation: "World Bank Group",
    type: "EV",
  } satisfies typeof data);
});

test("iana.org", async () => {
  const data = await get_data("iana.org");

  expect(data).toStrictEqual({
    countryCode: "US",
    organisation: "Internet Corporation For Assigned Names and Numbers",
    type: "OV",
  } satisfies typeof data);
});

test("example.com", async () => {
  const data = await get_data("example.com");

  expect(data).toStrictEqual({
    countryCode: "US",
    organisation: "Internet Corporation for Assigned Names and Numbers",
    type: "OV",
  } satisfies typeof data);
});

test("digicert.com", async () => {
  const data = await get_data("digicert.com");

  expect(data).toStrictEqual({
    businessCategory: "Private Organization",
    countryCode: "US",
    incCountryCode: "US",
    organisation: "DigiCert, Inc.",
    type: "EV",
  } satisfies typeof data);
});
