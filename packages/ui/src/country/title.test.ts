import { expect, test } from "vitest";
import { country_title } from "./title";

const labels = { office: "Office", incorporated: "Place of incorporation" };

test("one line per role", () => {
  expect(
    country_title("United States", ["office", "incorporated"], labels),
  ).toBe("United States\nOffice\nPlace of incorporation");
});

test("no meta shows only the name", () => {
  expect(country_title("Belgium", undefined, labels)).toBe("Belgium");
});

test("proxy warning comes first", () => {
  expect(country_title("Iceland", ["office"], labels, "Proxy country")).toBe(
    "Proxy country\nIceland\nOffice",
  );
});
