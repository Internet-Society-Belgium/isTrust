import { expect, test } from "vitest";
import { stringifyRdapValue } from "./type";

test("stringifyRdapValue string", async () => {
  expect(stringifyRdapValue("string")).toStrictEqual("string");
});

test("stringifyRdapValue string[]", async () => {
  expect(stringifyRdapValue(["string1", "string2"])).toStrictEqual(
    "string1 string2",
  );
});

test("stringifyRdapValue string[][]", async () => {
  expect(
    stringifyRdapValue([
      ["string1", "string2"],
      ["string3", "string4"],
    ]),
  ).toStrictEqual("string1 string2 string3 string4");
});

test("stringifyRdapValue (string | string[])[]", async () => {
  expect(
    stringifyRdapValue(["string1", "string2", ["string3", "string4"]]),
  ).toStrictEqual("string1 string2 string3 string4");
});
