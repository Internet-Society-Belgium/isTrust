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

test("lists the individual of a certificate", async () => {
  certificates = [{ type: "IV", issuer: ISSUER, individual: "Jane (Doe)" }];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    { value: "Jane (Doe)", verified: true, sources: [ISSUER] },
  ]);
});

test("lists the individuals of different certificates", async () => {
  certificates = [
    { type: "IV", issuer: ISSUER, individual: "Jane (Doe)" },
    { type: "IV", issuer: ISSUER, individual: "John (Doe)" },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    { value: "Jane (Doe)", verified: true, sources: [ISSUER] },
    { value: "John (Doe)", verified: true, sources: [ISSUER] },
  ]);
});

test("lists the same person once", async () => {
  certificates = [
    { type: "IV", issuer: ISSUER, individual: "Jane (Doe)" },
    { type: "IV", issuer: ISSUER, individual: "Jane (Doe)" },
  ];

  const data = await get_data("iv.example.test", true);

  expect(data?.individuals).toStrictEqual([
    { value: "Jane (Doe)", verified: true, sources: [ISSUER] },
  ]);
});
