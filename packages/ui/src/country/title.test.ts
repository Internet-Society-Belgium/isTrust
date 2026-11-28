import { expect, test } from "vitest";
import { country_title } from "./title";

const labels = { office: "Office", incorporated: "Incorporated in" };

test("office", () => {
  expect(
    country_title(
      "United States",
      [{ role: "office", owner: "Bank of America Corporation" }],
      labels,
    ),
  ).toBe("United States\nOffice: Bank of America Corporation");
});

test("incorporated", () => {
  expect(
    country_title(
      "Ireland",
      [
        {
          role: "incorporated",
          owner: "Bank of America Europe Designated Activity Company",
        },
      ],
      labels,
    ),
  ).toBe(
    "Ireland\nIncorporated in: Bank of America Europe Designated Activity Company",
  );
});

test("unnamed owner shows only the role", () => {
  expect(country_title("Belgium", [{ role: "office" }], labels)).toBe(
    "Belgium\nOffice",
  );
});

test("no meta shows only the name", () => {
  expect(country_title("Belgium", undefined, labels)).toBe("Belgium");
});

test("proxy warning comes first", () => {
  expect(
    country_title(
      "Iceland",
      [{ role: "office", owner: "Withheld for Privacy ehf" }],
      labels,
      "Proxy country",
    ),
  ).toBe("Proxy country\nIceland\nOffice: Withheld for Privacy ehf");
});
