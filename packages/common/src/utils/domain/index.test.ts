import { expect, test } from "vitest";
import { parse_domain, parse_tld } from ".";

test("рф", () => {
  expect(parse_tld("рф")).toStrictEqual("xn--p1ai");
});

test("wikipedia.org.", () => {
  expect(parse_domain("wikipedia.org.")).toStrictEqual("wikipedia.org");
});

test("https://istrust.org/", () => {
  expect(parse_domain("https://istrust.org/")).toStrictEqual("istrust.org");
});

test("ftp://istrust.org:21/", () => {
  expect(parse_domain("ftp://istrust.org:21/")).toStrictEqual("istrust.org");
});

test("mailto:istrust@isoc.be", () => {
  expect(parse_domain("mailto:istrust@isoc.be?subject=Test")).toStrictEqual(
    "isoc.be",
  );
});

test("https://istrust.org/login?redirect=https://isoc.be/", () => {
  expect(
    parse_domain("https://istrust.org/login?redirect=https://isoc.be/"),
  ).toStrictEqual("istrust.org");
});

test("аррӏе.com", () => {
  expect(parse_domain("аррӏе.com")).toStrictEqual("xn--80ak6aa92e.com");
});

test("10.10.10.10", () => {
  expect(() => parse_domain("10.10.10.10")).toThrowError(
    "IP addresses are not supported",
  );
});

test("tld", () => {
  expect(() => parse_domain("tld")).toThrowError("Invalid domain name");
});
