import * as x509 from "@peculiar/x509";
import * as oid from "../oid";
import { CertificateData } from "../type";

function arrayToString(array: string[]) {
  const text = array.join(" ").trim();
  if (text === "") return;
  return text;
}

export function parseCert(cert: x509.X509Certificate) {
  const data: CertificateData = {};

  const organisation = arrayToString(
    cert.subjectName.getField(oid.Organization),
  );
  if (organisation) {
    const organisation_unit = arrayToString(
      cert.subjectName.getField(oid.OrganizationalUnit),
    );
    if (organisation_unit) {
      data.organisation = `${organisation} (${organisation_unit})`;
    } else {
      data.organisation = organisation;
    }
  }

  const country = arrayToString(cert.subjectName.getField(oid.Country));
  if (country) {
    data.country = country;
  }

  const business_category = arrayToString(
    cert.subjectName.getField(oid.BusinessCategory),
  );
  if (business_category) {
    data.businessCategory = business_category;
  }

  const inc_country = arrayToString(cert.subjectName.getField(oid.IncCountry));
  if (inc_country) {
    data.incCountry = inc_country;
  }

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

  return data;
}

export async function isValidCert(cert: x509.X509Certificate, domain: string) {
  if (isExpired(cert)) return false;

  if (await cert.isSelfSigned()) return false;

  if (!isTLSCapable(cert)) return false;

  if (!isForDomain(cert, domain)) return false;

  return true;
}

function isExpired(cert: x509.X509Certificate) {
  const now = new Date();
  if (now < cert.notBefore || now > cert.notAfter) return true;
  return false;
}

function isTLSCapable(cert: x509.X509Certificate) {
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

function isForDomain(cert: x509.X509Certificate, domain: string) {
  const dnsNames = [];

  const commonName = arrayToString(cert.subjectName.getField(oid.CommonName));
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
