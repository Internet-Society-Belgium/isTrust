import * as x509 from "@peculiar/x509";
import { CertificateData } from "../type";
import * as oid from "./oid";

function atos(array: string[]) {
  const text = array.join(" ").trim();
  if (text === "") return;
  return text;
}

export type X509Certificate = x509.X509Certificate;

export function parse_cert(raw: string) {
  return new x509.X509Certificate(raw);
}

export function get_data(cert: X509Certificate) {
  const data: CertificateData = {};

  const certificatePolicyExtension = cert.getExtension(
    x509.CertificatePolicyExtension,
  );
  if (certificatePolicyExtension) {
    if (
      certificatePolicyExtension.policies.includes(oid.onionExtendedValidation)
    ) {
      data.type = "EV (.onion)";
    } else if (
      certificatePolicyExtension.policies.includes(oid.ExtendedValidation)
    ) {
      data.type = "EV";
    } else if (
      certificatePolicyExtension.policies.includes(oid.IndividualValidation)
    ) {
      data.type = "IV";
    } else if (
      certificatePolicyExtension.policies.includes(oid.OrganizationValidation)
    ) {
      data.type = "OV";
    } else if (
      certificatePolicyExtension.policies.includes(oid.DomainValidation)
    ) {
      data.type = "DV";
    }
  }

  const organisation = atos(cert.subjectName.getField(oid.Organization));
  if (organisation) {
    const organisation_unit = atos(
      cert.subjectName.getField(oid.OrganizationalUnit),
    );
    if (organisation_unit) {
      data.organisation = `${organisation} (${organisation_unit})`;
    } else {
      data.organisation = organisation;
    }
  }

  const country = atos(cert.subjectName.getField(oid.Country));
  if (country) {
    data.countryCode = country;
  }

  const business_category = atos(
    cert.subjectName.getField(oid.BusinessCategory),
  );
  if (business_category) {
    if (business_category === "Private Organization") {
      data.businessCategory = "Private Organization";
    } else if (business_category === "Government Entity") {
      data.businessCategory = "Government Entity";
    } else if (business_category === "Business Entity") {
      data.businessCategory = "Business Entity";
    } else if (business_category === "Non-Commercial Entity") {
      data.businessCategory = "Non-Commercial Entity";
    }
  }

  const inc_country = atos(cert.subjectName.getField(oid.IncCountry));
  if (inc_country) {
    data.incCountryCode = inc_country;
  }

  return data;
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
