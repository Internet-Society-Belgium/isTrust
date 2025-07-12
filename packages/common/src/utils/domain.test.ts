import { expect, test } from "vitest";
import { parse_domain } from "./domain";

test("wikipedia.org.", async () => {
  expect(parse_domain("wikipedia.org.")).toStrictEqual("wikipedia.org");
});

test("аррӏе.com", async () => {
  expect(parse_domain("аррӏе.com")).toStrictEqual("xn--80ak6aa92e.com");
});

test("10.10.10.10", async () => {
  expect(() => parse_domain("10.10.10.10")).toThrowError("Invalid domain");
});
