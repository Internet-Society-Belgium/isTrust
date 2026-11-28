import { describe, expect, test } from "vitest";
import {
  clean_values,
  format_individual,
  get_data,
  is_valid_cert,
  join_values,
  parse_cert,
} from ".";
import { CA, CLIENT_AUTH, DV, EV, EXPIRED, IV } from "./fixtures";

// Base64 DER, as returned by the Certspotter and MerkleMap APIs.
function pem_to_base64(pem: string) {
  return pem.replace(/-----(BEGIN|END) CERTIFICATE-----|\s/g, "");
}

describe("parse_cert", () => {
  test("parses PEM", () => {
    const cert = parse_cert(EV);
    expect(cert.subject).toContain("CN=example.test");
  });

  test("parses base64 DER", () => {
    const cert = parse_cert(pem_to_base64(EV));
    expect(cert.serialNumber).toStrictEqual(parse_cert(EV).serialNumber);
  });

  test("rejects invalid input", () => {
    expect(() => parse_cert("not a certificate")).toThrow();
  });
});

describe("get_data", () => {
  test("EV certificate", () => {
    expect(get_data(parse_cert(EV))).toStrictEqual({
      type: "EV",
      issuer: {
        organization: "isTrust Test CA",
        country: "BE",
        links: [],
      },
      organization: "Example Org (Web)",
      country: "BE",
      incCountry: "BE",
    });
  });

  test("IV certificate", () => {
    expect(get_data(parse_cert(IV))).toStrictEqual({
      type: "IV",
      issuer: {
        organization: "isTrust Test CA",
        country: "BE",
        links: [],
      },
      individual: "Jane (Doe)",
      country: "BE",
    });
  });

  test("DV certificate", () => {
    expect(get_data(parse_cert(DV))).toStrictEqual({
      type: "DV",
      issuer: {
        organization: "isTrust Test CA",
        country: "BE",
        links: [],
      },
    });
  });
});

describe("format_individual", () => {
  test("given name and surname", () => {
    expect(format_individual("Jane", "Doe")).toBe("Jane (Doe)");
  });

  test("given name only", () => {
    expect(format_individual("Jane", undefined)).toBe("Jane");
  });

  test("surname only", () => {
    expect(format_individual(undefined, "Doe")).toBe("Doe");
  });

  test("no name", () => {
    expect(format_individual(undefined, undefined)).toBeUndefined();
  });
});

describe("clean_values", () => {
  test("keeps each value", () => {
    expect(clean_values(["Jane", "Marie", "Doe"])).toStrictEqual([
      "Jane",
      "Marie",
      "Doe",
    ]);
  });

  test("trims each value", () => {
    expect(clean_values([" Jane ", "  Doe"])).toStrictEqual(["Jane", "Doe"]);
  });

  test("drops blank values", () => {
    expect(clean_values(["Jane", "", "  ", "Doe"])).toStrictEqual([
      "Jane",
      "Doe",
    ]);
  });

  test("no values", () => {
    expect(clean_values([])).toStrictEqual([]);
  });
});

describe("join_values", () => {
  test("joins values with one space", () => {
    expect(join_values(["Jane", "Marie"])).toBe("Jane Marie");
  });

  test("trims each value", () => {
    expect(join_values([" Jane ", "  Marie"])).toBe("Jane Marie");
  });

  test("ignores blank values", () => {
    expect(join_values(["Jane", "", "  ", "Marie"])).toBe("Jane Marie");
  });

  test("no values", () => {
    expect(join_values([])).toBeUndefined();
  });

  test("only blank values", () => {
    expect(join_values(["", " "])).toBeUndefined();
  });
});

describe("is_valid_cert", () => {
  test("matches the common name", async () => {
    expect(await is_valid_cert(parse_cert(EV), "example.test")).toBe(true);
  });

  test("matches a SAN name", async () => {
    expect(await is_valid_cert(parse_cert(EV), "www.example.test")).toBe(true);
  });

  test("rejects another domain", async () => {
    expect(await is_valid_cert(parse_cert(EV), "other.test")).toBe(false);
  });

  test("rejects a self-signed certificate", async () => {
    expect(await is_valid_cert(parse_cert(CA), "isTrust Test Root")).toBe(
      false,
    );
  });

  test("rejects a certificate without server authentication", async () => {
    expect(
      await is_valid_cert(parse_cert(CLIENT_AUTH), "client.example.test"),
    ).toBe(false);
  });

  test("rejects an expired certificate", async () => {
    expect(
      await is_valid_cert(parse_cert(EXPIRED), "expired.example.test"),
    ).toBe(false);
  });
});
