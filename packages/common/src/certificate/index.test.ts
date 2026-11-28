import { beforeEach, expect, test, vi } from "vitest";
import { get_data } from ".";
import { X509Data } from "./x509/type";

// Offline: every source returns the same certificate data, so the result does
// not depend on which source is picked first.
const ISSUER = { organization: "isTrust Test CA", country: "BE", links: [] };

let certificates: X509Data[] = [];

function source() {
  return { get_data: () => Promise.resolve(structuredClone(certificates)) };
}

vi.mock("./sslmate", () => source());
vi.mock("./merkelmap", () => source());
vi.mock("./crtsh", () => source());

beforeEach(() => {
  certificates = [];
});

function individual(value: string) {
  return { value, verified: true, sources: [ISSUER] };
}

test("lists the given name and the surname separately", async () => {
  certificates = [
    {
      type: "IV",
      issuer: ISSUER,
      individualNames: ["Internet Society", "ISOC"],
    },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Internet Society"),
    individual("ISOC"),
  ]);
});

test("lists a given name only", async () => {
  certificates = [
    { type: "IV", issuer: ISSUER, individualNames: ["Internet Society"] },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([individual("Internet Society")]);
});

test("lists a surname only", async () => {
  certificates = [{ type: "IV", issuer: ISSUER, individualNames: ["ISOC"] }];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([individual("ISOC")]);
});

test("lists a shared name once", async () => {
  certificates = [
    {
      type: "IV",
      issuer: ISSUER,
      individualNames: ["Internet Society", "ISOC"],
    },
    {
      type: "IV",
      issuer: ISSUER,
      individualNames: ["Internet Society Belgium", "ISOC"],
    },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Internet Society"),
    individual("ISOC"),
    individual("Internet Society Belgium"),
  ]);
});

test("lists the same person once", async () => {
  certificates = [
    {
      type: "IV",
      issuer: ISSUER,
      individualNames: ["Internet Society", "ISOC"],
    },
    {
      type: "IV",
      issuer: ISSUER,
      individualNames: ["Internet Society", "ISOC"],
    },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Internet Society"),
    individual("ISOC"),
  ]);
});
