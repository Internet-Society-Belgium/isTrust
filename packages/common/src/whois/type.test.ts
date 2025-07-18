import { expect, test } from "vitest";
import { stringify_rdap_value } from "./type";

test("stringify_rdap_value string", () => {
  expect(stringify_rdap_value("string")).toStrictEqual("string");
});

test("stringify_rdap_value string[]", () => {
  expect(stringify_rdap_value(["string1", "string2"])).toStrictEqual(
    "string1 string2",
  );
});

test("stringify_rdap_value string[][]", () => {
  expect(
    stringify_rdap_value([
      ["string1", "string2"],
      ["string3", "string4"],
    ]),
  ).toStrictEqual("string1 string2 string3 string4");
});

test("stringify_rdap_value (string | string[])[]", () => {
  expect(
    stringify_rdap_value(["string1", "string2", ["string3", "string4"]]),
  ).toStrictEqual("string1 string2 string3 string4");
});
