import { expect, test } from "vitest";
import { deepMerge } from "./object";

test("WHOIS amazonaws.com from empty", async () => {
  const target = {};
  const source = {
    domain: "amazonaws.com",
    events: {
      registration: new Date("2005-08-18T02:10:45.000Z"),
    },
    dnssec: false,
  };
  deepMerge(target, source);

  expect(target).toStrictEqual({
    domain: "amazonaws.com",
    events: {
      registration: new Date("2005-08-18T02:10:45.000Z"),
    },
    dnssec: false,
  });
});

test("WHOIS amazonaws.com merge", async () => {
  const target = {
    domain: "amazonaws.com",
    events: {
      registration: new Date("2005-08-18T02:10:45.000Z"),
    },
    dnssec: false,
  };
  const source = {
    domain: "amazonaws.com",
    events: {
      registration: new Date("2005-08-18T02:10:45.000Z"),
    },
    registrant: {
      organization: "Amazon.com, Inc.",
      address: {
        state: "Seattle",
        region: "WA",
        country: "US",
      },
    },
    dnssec: false,
  };
  deepMerge(target, source);

  expect(target).toStrictEqual({
    domain: "amazonaws.com",
    events: {
      registration: new Date("2005-08-18T02:10:45.000Z"),
    },
    registrant: {
      organization: "Amazon.com, Inc.",
      address: {
        state: "Seattle",
        region: "WA",
        country: "US",
      },
    },
    dnssec: false,
  });
});
