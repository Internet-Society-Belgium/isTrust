import { improve_array } from "../utils/array";
import * as sslmate from "./sslmate";
import { CertificateData, CertificateType } from "./type";

export async function get_data(domain: string) {
  const x509sData = await sslmate.get_data(domain);

  if (x509sData === undefined || x509sData.length === 0) return;

  const certificateData: CertificateData = {};

  x509sData.sort(
    (a, b) => certificate_type_score(b.type) - certificate_type_score(a.type),
  );

  for (const x509Data of x509sData) {
    if (x509Data.type) {
      const improvedType = improve_array(certificateData.type, x509Data.type);
      if (improvedType) {
        certificateData.type = improvedType;
      }
    }

    if (x509Data.individual) {
      const improvedIndividual = improve_array(
        certificateData.individual,
        x509Data.individual,
      );
      if (improvedIndividual) {
        certificateData.individual = improvedIndividual;
      }
    }

    if (x509Data.country) {
      const improvedCountry = improve_array(
        certificateData.country,
        x509Data.country,
      );
      if (improvedCountry) {
        certificateData.country = improvedCountry;
      }
    }

    if (x509Data.organization) {
      const improvedOrganization = improve_array(
        certificateData.organization,
        x509Data.organization,
      );
      if (improvedOrganization) {
        certificateData.organization = improvedOrganization;
      }
    }

    if (x509Data.incCountry) {
      const improvedCountry = improve_array(
        certificateData.country,
        x509Data.incCountry,
      );
      if (improvedCountry) {
        certificateData.country = improvedCountry;
      }
    }

    if (x509Data.businessCategory) {
      const improvedBusinessCategory = improve_array(
        certificateData.businessCategory,
        x509Data.businessCategory,
      );
      if (improvedBusinessCategory) {
        certificateData.businessCategory = improvedBusinessCategory;
      }
    }
  }

  return certificateData;
}

function certificate_type_score(type?: CertificateType) {
  if (type === "EV") return 4;
  else if (type === "IV") return 3;
  else if (type === "OV") return 2;
  else if (type === "DV") return 1;
  return 0;
}
