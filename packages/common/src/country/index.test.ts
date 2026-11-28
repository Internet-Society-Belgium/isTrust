import { describe, expect, test } from "vitest";
import type { Information } from "../type";
import { normalize_country, sort_countries } from "./index";

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
    undefined,
  ])("drops %j", (input) => {
    expect(normalize_country(input)).toBeUndefined();
  });
});

test("sort_countries: verified, then unverified, then proxy; stable", () => {
  const item = (value: string, verified?: boolean): Information<string> => ({
    value,
    sources: [],
    ...(verified === undefined ? {} : { verified }),
  });
  const items = [
    item("A", true),
    item("B", false),
    item("C", true),
    item("D"),
    item("E", true),
  ];

  const sorted = sort_countries(items, (country) => country.value === "A");

  expect(sorted?.map((i) => i.value)).toStrictEqual(["C", "E", "B", "D", "A"]);
});
