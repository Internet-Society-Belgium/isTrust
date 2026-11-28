import { describe, expect, test } from "vitest";
import type { WHOISData } from "../type";
import * as fixtures from "./fixtures";
import { improve_data } from "./index";
import { validate_rdap_result } from "./type";

function run(fixture: unknown) {
  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };
  improve_data(data, validate_rdap_result(fixture));
  return data;
}

describe("improve_data countries", () => {
  test("privacy service registrant keeps its country", () => {
    const data = run(fixtures.NAMECHEAP);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "NAMECHEAP INC", links: [] }],
      },
    ]);
  });

  test("owner country", () => {
    const data = run(fixtures.BANKOFAMERICA);

    expect(data.countries).toStrictEqual([
      {
        value: "US",
        verified: false,
        sources: [{ organization: "CSC Corporate Domains, Inc.", links: [] }],
      },
    ]);
  });

  test("Belgian owner", () => {
    const data = run(fixtures.ISTRUST);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["BE"]);
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Internet Society Chapter Belgium vzw/asbl",
    ]);
  });

  test("registrant without name or organization keeps country, no owner", () => {
    const data = run(fixtures.GITHUB);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
    expect(data.organizations).toStrictEqual([]);
  });

  test("placeholder cc is dropped", () => {
    const data = run(fixtures.CC_REDACTED);

    expect(data.countries).toStrictEqual([]);
    expect(data.organizations.map((o) => o.value)).toStrictEqual([
      "Bank of America Corporation",
    ]);
  });

  test("country name in address label is normalized", () => {
    const data = run(fixtures.LABEL_UNITED_STATES);

    expect(data.countries.map((c) => c.value)).toStrictEqual(["US"]);
  });
});
