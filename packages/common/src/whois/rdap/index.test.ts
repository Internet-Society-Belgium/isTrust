import { expect, test } from "vitest";
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

test.each([
  ["namecheap", fixtures.NAMECHEAP, ["US"]],
  ["bankofamerica", fixtures.BANKOFAMERICA, ["US"]],
  ["istrust", fixtures.ISTRUST, ["BE"]],
  ["github, no owner", fixtures.GITHUB, ["US"]],
  ["placeholder cc is dropped", fixtures.CC_REDACTED, []],
  ["country name in the label", fixtures.LABEL_UNITED_STATES, ["US"]],
])("improve_data countries: %s", (_, fixture, expected) => {
  expect(run(fixture).countries.map((c) => c.value)).toStrictEqual(expected);
});
