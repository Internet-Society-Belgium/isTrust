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
  ])("drops %j", (input) => {
    expect(normalize_country(input)).toBeUndefined();
  });

  test("undefined", () => {
    expect(normalize_country(undefined)).toBeUndefined();
  });
});

describe("sort_countries", () => {
  const item = (
    value: string,
    flags: { verified?: boolean; proxy?: true } = {},
  ): Information<string> => ({ value, sources: [], ...flags });

  test("verified, then unverified, then proxy; stable inside each group", () => {
    const items = [
      item("A", { proxy: true }),
      item("B", { verified: false }),
      item("C", { verified: true }),
      item("D"),
      item("E", { verified: true }),
    ];

    expect(sort_countries(items)?.map((i) => i.value)).toStrictEqual([
      "C",
      "E",
      "B",
      "D",
      "A",
    ]);
  });

  test("does not mutate input", () => {
    const items = [item("B"), item("A", { verified: true })];
    sort_countries(items);
    expect(items.map((i) => i.value)).toStrictEqual(["B", "A"]);
  });

  test("undefined stays undefined", () => {
    expect(sort_countries(undefined)).toBeUndefined();
  });
});
