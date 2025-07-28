import { improve_data_array } from "../type";
import * as sslmate from "./sslmate";
import { CertificateData, CertificateType } from "./type";

export async function get_data(domain: string) {
  const x509sData = await sslmate.get_data(domain);

  const certificateData: CertificateData = {
    types: null,
    individuals: null,
    organizations: null,
    countries: null,
    businessCategories: null,
  };

  if (x509sData.length === 0) return certificateData;

  x509sData.sort(
    (a, b) => certificate_type_score(b.type) - certificate_type_score(a.type),
  );

  for (const x509Data of x509sData) {
    const improvedTypes = improve_data_array(certificateData.types, {
      value: x509Data.type,
      verification: {
        status: "verified",
        authorities: [x509Data.issuer],
      },
    });
    if (improvedTypes.length > 0) {
      certificateData.types = improvedTypes;
    }

    if (x509Data.individual) {
      const improvedIndividuals = improve_data_array(
        certificateData.individuals,
        {
          value: x509Data.individual,
          verification: {
            status: "verified",
            authorities: [x509Data.issuer],
          },
        },
      );
      if (improvedIndividuals.length > 0) {
        certificateData.individuals = improvedIndividuals;
      }
    }

    if (x509Data.country) {
      const improvedCountries = improve_data_array(certificateData.countries, {
        value: x509Data.country,
        verification: {
          status: "verified",
          authorities: [x509Data.issuer],
        },
      });
      if (improvedCountries.length > 0) {
        certificateData.countries = improvedCountries;
      }
    }

    if (x509Data.organization) {
      const improvedOrganizations = improve_data_array(
        certificateData.organizations,
        {
          value: x509Data.organization,
          verification: {
            status: "verified",
            authorities: [x509Data.issuer],
          },
        },
      );
      if (improvedOrganizations.length > 0) {
        certificateData.organizations = improvedOrganizations;
      }
    }

    if (x509Data.incCountry) {
      const improvedCountries = improve_data_array(certificateData.countries, {
        value: x509Data.incCountry,
        verification: {
          status: "verified",
          authorities: [x509Data.issuer],
        },
      });
      if (improvedCountries.length > 0) {
        certificateData.countries = improvedCountries;
      }
    }

    if (x509Data.businessCategory) {
      const improvedBusinessCategories = improve_data_array(
        certificateData.businessCategories,
        {
          value: x509Data.businessCategory,
          verification: {
            status: "verified",
            authorities: [x509Data.issuer],
          },
        },
      );
      if (improvedBusinessCategories.length > 0) {
        certificateData.businessCategories = improvedBusinessCategories;
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
