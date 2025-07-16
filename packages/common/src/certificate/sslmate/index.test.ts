import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual([
    {
      type: "DV",
    },
  ] satisfies typeof data);
});

test("icann.org", async () => {
  const data = await get_data("icann.org");

  expect(data).toStrictEqual([
    {
      type: "DV",
    },
    {
      countryCode: "US",
      organisation: "Internet Corporation For Assigned Names and Numbers",
      type: "OV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
  ] satisfies typeof data);
});

test("worldbank.org", async () => {
  const data = await get_data("worldbank.org");

  expect(data).toStrictEqual([
    {
      type: "DV",
    },
    {
      type: "DV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      businessCategory: "Non-Commercial Entity",
      countryCode: "US",
      incCountryCode: "US",
      organisation: "World Bank Group",
      type: "EV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
    {
      type: "DV",
    },
  ] satisfies typeof data);
});
