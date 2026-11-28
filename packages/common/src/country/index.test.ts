import { describe, expect, test } from "vitest";
import { normalize_country } from "./index";

describe("normalize_country", () => {
  test.each([
    ["US", "US"],
    ["us", "US"],
    ["  be  ", "BE"],
    ["UK", "GB"],
    ["gb", "GB"],
    ["XK", "XK"],
    ["United States", "US"],
    ["united states", "US"],
    ["Belgium", "BE"],
  ])("%j -> %j", (input, expected) => {
    expect(normalize_country(input)).toBe(expected);
  });

  test.each([
    "REDACTED",
    "DATA REDACTED",
    "ZZ",
    "EU",
    "A1",
    "XX",
    "",
    "   ",
    "Atlantis",
  ])("drops %j", (input) => {
    expect(normalize_country(input)).toBeUndefined();
  });

  test("undefined", () => {
    expect(normalize_country(undefined)).toBeUndefined();
  });
});
