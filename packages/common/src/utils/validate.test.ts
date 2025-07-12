import { expect, test } from "vitest";
import { parse_domain } from "./validate";

test("wikipedia.org.", async () => {
  expect(parse_domain("wikipedia.org.")).toStrictEqual("wikipedia.org");
});

test("аррӏе.com", async () => {
  expect(() => parse_domain("аррӏе.com")).toThrowError("Invalid character");
});

test("10.10.10.10", async () => {
  expect(() => parse_domain("10.10.10.10")).toThrowError("Invalid domain");
});
