import { expect, test } from "vitest";
import { get_data } from ".";

test("istrust.org", async () => {
  const data = await get_data("istrust.org");

  expect(data).toStrictEqual({
    type: ["DV"],
  } satisfies typeof data);
});

test("icann.org", async () => {
  const data = await get_data("icann.org");

  expect(data).toStrictEqual({
    country: ["US"],
    organization: ["Internet Corporation For Assigned Names and Numbers"],
    type: ["OV", "DV"],
  } satisfies typeof data);
});

test("worldbank.org", async () => {
  const data = await get_data("worldbank.org");

  expect(data).toStrictEqual({
    businessCategory: ["Non-Commercial Entity"],
    country: ["US"],
    organization: ["World Bank Group"],
    type: ["EV", "DV"],
  } satisfies typeof data);
});

test("iana.org", async () => {
  const data = await get_data("iana.org");

  expect(data).toStrictEqual({
    country: ["US"],
    organization: ["Internet Corporation For Assigned Names and Numbers"],
    type: ["OV"],
  } satisfies typeof data);
});

test("example.com", async () => {
  const data = await get_data("example.com");

  expect(data).toStrictEqual({
    country: ["US"],
    organization: [
      "Internet Corporation for Assigned Names and Numbers",
      "Internet Corporation for Assigned Names and Numbers",
    ],
    type: ["OV"],
  } satisfies typeof data);
});

test("digicert.com", async () => {
  const data = await get_data("digicert.com");

  expect(data).toStrictEqual({
    businessCategory: ["Private Organization"],
    country: ["US"],
    organization: ["DigiCert, Inc."],
    type: ["EV", "OV"],
  } satisfies typeof data);
});

test("google.com", async () => {
  const data = await get_data("google.com");

  expect(data).toStrictEqual({
    businessCategory: ["Private Organization"],
    country: ["BR"],
    organization: ["GOOGLE PAY BRASIL INSTITUICAO DE PAGAMENTO LTDA"],
    type: ["OV", "DV"],
  } satisfies typeof data);
});
