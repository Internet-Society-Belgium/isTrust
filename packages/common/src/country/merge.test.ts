import { expect, test } from "vitest";
import { improve_informations, Information, merge_informations } from "../type";
import { CountryInformation } from "./type";

function country(
  value: string,
  meta: CountryInformation["meta"],
): CountryInformation {
  return { value, sources: [], verified: true, meta };
}

test("merge unions roles under the same country code", () => {
  // Bank of America: the US is both its office and where it is incorporated.
  expect(
    merge_informations(
      [country("US", ["office"])],
      [country("US", ["incorporated"])],
    ),
  ).toStrictEqual([country("US", ["office", "incorporated"])]);
});

test("merge keeps one role when both sides agree", () => {
  expect(
    merge_informations(
      [country("IE", ["incorporated"])],
      [country("IE", ["incorporated"])],
    ),
  ).toStrictEqual([country("IE", ["incorporated"])]);
});

test("meta dedupes on first insert", () => {
  const informations: CountryInformation[] = [];

  improve_informations(informations, country("BE", ["office", "office"]));

  expect(informations[0]?.meta).toStrictEqual(["office"]);
});

test("meta merges on any information type", () => {
  const informations: Information<string, string>[] = [
    { value: "Example Org", sources: [] },
  ];

  improve_informations(informations, {
    value: "example org",
    sources: [],
    meta: ["a", "a", "b"],
  });

  expect(informations[0]?.meta).toStrictEqual(["a", "b"]);
});
