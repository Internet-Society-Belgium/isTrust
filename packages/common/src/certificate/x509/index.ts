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
  if (certificatePolicyExtension?.policies.includes(oid.ExtendedValidation)) {
    type = "EV";
  } else if (
    certificatePolicyExtension?.policies.includes(oid.OrganizationValidation)
  ) {
    type = "OV";
  } else if (
    certificatePolicyExtension?.policies.includes(oid.IndividualValidation)
  ) {
    type = "IV";
  } else {
    type = "DV";
  }

  const issuer: X509Issuer = {};

  const issuerOrganization = atos(cert.issuerName.getField(oid.Organization));
  if (issuerOrganization !== undefined) {
    issuer.organization = issuerOrganization;
  }

  const issuerCountry = atos(cert.issuerName.getField(oid.Country));
  if (issuerCountry !== undefined) {
    issuer.country = issuerCountry;
  }

  const data: X509Data = { type, issuer };

  const subjectOrganization = atos(cert.subjectName.getField(oid.Organization));
  if (subjectOrganization) {
    const organizationUnit = atos(
      cert.subjectName.getField(oid.OrganizationalUnit),
    );
    if (organizationUnit) {
      data.organization = `${subjectOrganization} (${organizationUnit})`;
    } else {
      data.organization = subjectOrganization;
    }
  }

  const subjectCountry = atos(cert.subjectName.getField(oid.Country));
  if (subjectCountry) {
    data.country = subjectCountry;
  }

  const subjectIncCountry = atos(cert.subjectName.getField(oid.IncCountry));
  if (subjectIncCountry) {
    data.incCountry = subjectIncCountry;
  }

  const subjectBusinessCategory = atos(
    cert.subjectName.getField(oid.BusinessCategory),
  );

  if (subjectBusinessCategory === "Private Organization") {
    data.businessCategory = "Private Organization";
  } else if (subjectBusinessCategory === "Government Entity") {
    data.businessCategory = "Government Entity";
  } else if (subjectBusinessCategory === "Business Entity") {
    data.businessCategory = "Business Entity";
  } else if (subjectBusinessCategory === "Non-Commercial Entity") {
    data.businessCategory = "Non-Commercial Entity";
  }

  const subjectGivenName = atos(cert.subjectName.getField(oid.GivenName));
  if (subjectGivenName) {
    data.individual = subjectGivenName;
  }

  return data;
}

function atos(array: string[]) {
  const text = array.join(" ").trim();
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
    extendedKeyUsageExtension.usages.includes(oid.ServerAuthentication)
  ) {
    return true;
  }

  return false;
}

function is_same_domain(cert: X509Certificate, domain: string) {
  const dnsNames = [];

  const commonName = atos(cert.subjectName.getField(oid.CommonName));
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
