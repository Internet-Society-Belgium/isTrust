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
    { type: "IV", issuer: ISSUER, individualNames: ["Jane", "Doe"] },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Jane"),
    individual("Doe"),
  ]);
});

test("lists a given name only", async () => {
  certificates = [{ type: "IV", issuer: ISSUER, individualNames: ["Jane"] }];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([individual("Jane")]);
});

test("lists a surname only", async () => {
  certificates = [{ type: "IV", issuer: ISSUER, individualNames: ["Doe"] }];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([individual("Doe")]);
});

test("lists a shared name once", async () => {
  certificates = [
    { type: "IV", issuer: ISSUER, individualNames: ["Jane", "Doe"] },
    { type: "IV", issuer: ISSUER, individualNames: ["John", "Doe"] },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Jane"),
    individual("Doe"),
    individual("John"),
  ]);
});

test("lists the same person once", async () => {
  certificates = [
    { type: "IV", issuer: ISSUER, individualNames: ["Jane", "Doe"] },
    { type: "IV", issuer: ISSUER, individualNames: ["Jane", "Doe"] },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    individual("Jane"),
    individual("Doe"),
  ]);
});
