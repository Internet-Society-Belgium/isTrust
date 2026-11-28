import * as x509 from "@peculiar/x509";
import { CertificateType } from "../type";
import * as oid from "./oid";
import { X509Data, X509Issuer } from "./type";

export type X509Certificate = x509.X509Certificate;

export function parse_cert(raw: string) {
  return new x509.X509Certificate(raw);
}

// https://cabforum.org/working-groups/server/baseline-requirements/documents/
// https://cabforum.org/working-groups/server/extended-validation/documents/
export function get_data(cert: X509Certificate) {
  let type: CertificateType;

  const certificatePolicyExtension = cert.getExtension(
    x509.CertificatePolicyExtension,
  );
  if (
    certificatePolicyExtension?.policies.includes(oid.EXTENDED_VALIDATION) ===
    true
  ) {
    type = "EV";
  } else if (
    certificatePolicyExtension?.policies.includes(
      oid.ORGANIZATION_VALIDATION,
    ) === true
  ) {
    type = "OV";
  } else if (
    certificatePolicyExtension?.policies.includes(oid.INDIVIDUAL_VALIDATION) ===
    true
  ) {
    type = "IV";
  } else {
    type = "DV";
  }

  const data: X509Data = {
    type,
  };

  let issuer: X509Issuer | undefined;

  let organization: string | undefined;

  const issuerOrganization = join_values(
    cert.issuerName.getField(oid.ORGANIZATION),
  );
  if (issuerOrganization !== undefined) {
    organization = issuerOrganization;
  }

  if (organization !== undefined) {
    issuer = {
      organization,
      links: [],
    };

    const issuerCountry = join_values(cert.issuerName.getField(oid.COUNTRY));
    if (issuerCountry !== undefined) {
      issuer.country = issuerCountry;
    }
  }

  if (issuer !== undefined) {
    data.issuer = issuer;
  }

  const subjectOrganization = join_values(
    cert.subjectName.getField(oid.ORGANIZATION),
  );
  if (subjectOrganization !== undefined) {
    const organizationUnit = join_values(
      cert.subjectName.getField(oid.ORGANIZATION_UNIT),
    );
    if (organizationUnit !== undefined) {
      data.organization = `${subjectOrganization} (${organizationUnit})`;
    } else {
      data.organization = subjectOrganization;
    }
  }

  const subjectCountry = join_values(cert.subjectName.getField(oid.COUNTRY));
  if (subjectCountry !== undefined) {
    data.country = subjectCountry;
  }

  const subjectIncCountry = join_values(
    cert.subjectName.getField(oid.INC_COUNTRY),
  );
  if (subjectIncCountry !== undefined) {
    data.incCountry = subjectIncCountry;
  }

  // IV certificates carry the name as separate givenName and surname fields.
  // Each one is kept as its own name.
  const subjectIndividualNames = [oid.GIVEN_NAME, oid.SURNAME]
    .map((field) => join_values(cert.subjectName.getField(field)))
    .filter((name) => name !== undefined);
  if (subjectIndividualNames.length > 0) {
    data.individualNames = subjectIndividualNames;
  }

  return data;
}

// Trims the values of a certificate field and drops blank ones.
export function clean_values(values: string[]) {
  return values.map((value) => value.trim()).filter((value) => value !== "");
}

// Joins the values of a certificate field with one space, ignoring blank
// values and surrounding whitespace.
export function join_values(values: string[]) {
  const text = clean_values(values).join(" ");
  if (text === "") return;
  return text;
}

export async function is_valid_cert(cert: X509Certificate, domain: string) {
  if (is_expired(cert)) return false;

  if (await cert.isSelfSigned()) return false;

  if (!is_tls_capable(cert)) return false;

  if (!is_same_domain(cert, domain)) return false;

  return true;
}

function is_expired(cert: X509Certificate) {
  const now = new Date();
  if (now < cert.notBefore || now > cert.notAfter) return true;
  return false;
}

function is_tls_capable(cert: X509Certificate) {
  // https://wiki.mozilla.org/CA/EV_Processing_for_CAs#EV_TLS_Capable
  const extendedKeyUsageExtension = cert.getExtension(
    x509.ExtendedKeyUsageExtension,
  );
  if (
    extendedKeyUsageExtension !== null &&
    extendedKeyUsageExtension.usages.includes(oid.SERVER_AUTHENTICATION)
  ) {
    return true;
  }

  return false;
}

function is_same_domain(cert: X509Certificate, domain: string) {
  const dnsNames = [];

  const commonName = join_values(cert.subjectName.getField(oid.COMMON_NAME));
  if (commonName !== undefined) {
    dnsNames.push(commonName);
  }

  const subjectAlternativeNameExtension = cert.getExtension(
    x509.SubjectAlternativeNameExtension,
  );
  if (subjectAlternativeNameExtension !== null) {
    const altNames = subjectAlternativeNameExtension.names.items;
    const dnsAltNames = altNames
      .filter((altName) => altName.type === "dns")
      .map((generalName) => generalName.value);
    dnsNames.push(...dnsAltNames);
  }

  for (const dnsName of dnsNames) {
    if (dnsName === domain) return true;
    if (dnsName === `*.${domain}`) return true;
  }

  return false;
}
