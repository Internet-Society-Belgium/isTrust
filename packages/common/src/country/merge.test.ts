import { expect, test } from "vitest";
import { improve_informations, Information, merge_informations } from "../type";
import { CountryInformation } from "./type";

function country(
  value: string,
  meta: CountryInformation["meta"],
): CountryInformation {
  return { value, sources: [], verified: true, meta };
}

test("merge unions meta under the same country code", () => {
  // Bank of America: the US is both where the company has its office and
  // where it is incorporated.
  const certificate = [
    country("US", [{ role: "office", owner: "Bank of America Corporation" }]),
  ];
  const whois = [
    country("US", [
      { role: "incorporated", owner: "Bank of America Corporation" },
    ]),
  ];

  expect(merge_informations(certificate, whois)).toStrictEqual([
    {
      value: "US",
      sources: [],
      verified: true,
      meta: [
        { role: "office", owner: "Bank of America Corporation" },
        { role: "incorporated", owner: "Bank of America Corporation" },
      ],
    },
  ]);
});

test("merge keeps one entry for a country with a single meta", () => {
  const certificate = [
    country("IE", [
      {
        role: "incorporated",
        owner: "Bank of America Europe Designated Activity Company",
      },
    ]),
  ];
  const whois = [
    country("IE", [
      {
        role: "incorporated",
        owner: "Bank of America Europe Designated Activity Company",
      },
    ]),
  ];

  expect(merge_informations(certificate, whois)).toStrictEqual([
    {
      value: "IE",
      sources: [],
      verified: true,
      meta: [
        {
          role: "incorporated",
          owner: "Bank of America Europe Designated Activity Company",
        },
      ],
    },
  ]);
});

test("meta dedupes on role and normalized owner", () => {
  const informations: CountryInformation[] = [];

  improve_informations(informations, {
    value: "BE",
    sources: [],
    verified: false,
    meta: [
      { role: "office", owner: "Example Org" },
      { role: "office", owner: "Example Org" },
    ],
  });
  improve_informations(informations, {
    value: "BE",
    sources: [],
    verified: false,
    meta: [{ role: "office", owner: "EXAMPLE, ORG." }],
  });

  expect(informations[0]?.meta).toStrictEqual([
    { role: "office", owner: "Example Org" },
  ]);
});

test("meta keeps unnamed owners apart from named ones", () => {
  const informations: CountryInformation[] = [
    country("BE", [{ role: "office" }]),
  ];

  improve_informations(informations, {
    ...country("BE", [{ role: "office", owner: "Example Org" }]),
    verified: false,
  });

  expect(informations[0]?.meta).toStrictEqual([
    { role: "office" },
    { role: "office", owner: "Example Org" },
  ]);
});

test("meta merges on any information type", () => {
  const informations: Information<string, { tag: string }>[] = [
    { value: "Example Org", sources: [] },
  ];

  improve_informations(informations, {
    value: "Example Org",
    sources: [],
    meta: [{ tag: "a" }, { tag: "a" }],
  });
  improve_informations(informations, {
    value: "example org",
    sources: [],
    meta: [{ tag: "b" }],
  });

  expect(informations[0]?.meta).toStrictEqual([{ tag: "a" }, { tag: "b" }]);
});
