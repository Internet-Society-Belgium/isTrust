import { expect, test } from "vitest";
import { parse_domain } from "./domain";

test("wikipedia.org.", async () => {
  expect(parse_domain("wikipedia.org.")).toStrictEqual("wikipedia.org");
});

test("https://istrust.org/", async () => {
  expect(parse_domain("https://istrust.org/")).toStrictEqual("istrust.org");
});

test("ftp://istrust.org:21/", async () => {
  expect(parse_domain("ftp://istrust.org:21/")).toStrictEqual("istrust.org");
});

test("mailto:istrust@isoc.be", async () => {
  expect(parse_domain("mailto:istrust@isoc.be?subject=Test")).toStrictEqual(
    "isoc.be",
  );
});

test("https://istrust.org/login?redirect=https://isoc.be/", async () => {
  expect(
    parse_domain("https://istrust.org/login?redirect=https://isoc.be/"),
  ).toStrictEqual("istrust.org");
});

test("аррӏе.com", async () => {
  expect(parse_domain("аррӏе.com")).toStrictEqual("xn--80ak6aa92e.com");
});

test("10.10.10.10", async () => {
  expect(() => parse_domain("10.10.10.10")).toThrowError(
    "IP addresses are not supported",
  );
});

test("tld", async () => {
  expect(() => parse_domain("tld")).toThrowError("Invalid domain name");
});
