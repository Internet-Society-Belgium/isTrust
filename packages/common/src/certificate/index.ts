import { improve_data_array } from "../type";
import * as sslmate from "./sslmate";
import { CertificateData, CertificateType } from "./type";

export async function get_data(domain: string) {
  const x509sData = await sslmate.get_data(domain);

  // await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

  if (x509sData === undefined || x509sData.length === 0) return;

  const certificateData: CertificateData = {};

  x509sData.sort(
    (a, b) => certificate_type_score(b.type) - certificate_type_score(a.type),
  );

  for (const x509Data of x509sData) {
    const improvedType = improve_data_array(certificateData.type, {
      value: x509Data.type,
      verification: {
        status: "verified",
        authority: [x509Data.issuer],
      },
    });
    if (improvedType.length > 0) {
      certificateData.type = improvedType;
    }

    if (x509Data.individual) {
      const improvedIndividual = improve_data_array(
        certificateData.individuals,
        {
          value: x509Data.individual,
          verification: {
            status: "verified",
            authority: [x509Data.issuer],
          },
        },
      );
      if (improvedIndividual.length > 0) {
        certificateData.individuals = improvedIndividual;
      }
    }

    if (x509Data.country) {
      const improvedCountry = improve_data_array(certificateData.countries, {
        value: x509Data.country,
        verification: {
          status: "verified",
          authority: [x509Data.issuer],
        },
      });
      if (improvedCountry.length > 0) {
        certificateData.countries = improvedCountry;
      }
    }

    if (x509Data.organization) {
      const improvedOrganization = improve_data_array(
        certificateData.organizations,
        {
          value: x509Data.organization,
          verification: {
            status: "verified",
            authority: [x509Data.issuer],
          },
        },
      );
      if (improvedOrganization.length > 0) {
        certificateData.organizations = improvedOrganization;
      }
    }

    if (x509Data.incCountry) {
      const improvedCountry = improve_data_array(certificateData.countries, {
        value: x509Data.incCountry,
        verification: {
          status: "verified",
          authority: [x509Data.issuer],
        },
      });
      if (improvedCountry.length > 0) {
        certificateData.countries = improvedCountry;
      }
    }

    if (x509Data.businessCategory) {
      const improvedBusinessCategory = improve_data_array(
        certificateData.businessCategories,
        {
          value: x509Data.businessCategory,
          verification: {
            status: "verified",
            authority: [x509Data.issuer],
          },
        },
      );
      if (improvedBusinessCategory.length > 0) {
        certificateData.businessCategories = improvedBusinessCategory;
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
