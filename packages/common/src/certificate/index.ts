import { improve_informations } from "../type";
import * as crtsh from "./crtsh";
import * as sslmate from "./sslmate";
import { CertificateData, CertificateType } from "./type";
import { X509Data } from "./x509/type";

const DATA_SOURCE: {
  get: (domain: string) => Promise<X509Data[]>;
  cors: boolean;
}[] = [
  {
    get: sslmate.get_data,
    cors: false,
  },
  {
    get: crtsh.get_data,
    cors: true,
  },
];

export async function get_data(domain: string, canBypassCORS: boolean) {
  const certificateData: CertificateData = {
    types: [],
    individuals: [],
    organizations: [],
    countries: [],
  };

  const dataSources = DATA_SOURCE.filter(({ cors }) =>
    canBypassCORS === true ? true : cors === false,
  )
    .map((value) => ({
      value,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (const dataSource of dataSources) {
    const x509sData = await dataSource.get(domain);

    if (x509sData.length === 0) continue;

    x509sData.sort(
      (a, b) => certificate_type_score(b.type) - certificate_type_score(a.type),
    );

    for (const x509Data of x509sData) {
      const improvedTypes = improve_informations(certificateData.types, {
        value: x509Data.type,
        verified: true,
        sources: x509Data.issuer !== undefined ? [x509Data.issuer] : [],
      });
      if (improvedTypes.length > 0) {
        certificateData.types = improvedTypes;
      }

      if (x509Data.individual !== undefined) {
        const improvedIndividuals = improve_informations(
          certificateData.individuals,
          {
            value: x509Data.individual,
            verified: true,
            sources: x509Data.issuer !== undefined ? [x509Data.issuer] : [],
          },
        );
        if (improvedIndividuals.length > 0) {
          certificateData.individuals = improvedIndividuals;
        }
      }

      if (x509Data.country !== undefined) {
        const improvedCountries = improve_informations(
          certificateData.countries,
          {
            value: x509Data.country,
            verified: true,
            sources: x509Data.issuer !== undefined ? [x509Data.issuer] : [],
          },
        );
        if (improvedCountries.length > 0) {
          certificateData.countries = improvedCountries;
        }
      }

      if (x509Data.organization !== undefined) {
        const improvedOrganizations = improve_informations(
          certificateData.organizations,
          {
            value: x509Data.organization,
            verified: true,
            sources: x509Data.issuer !== undefined ? [x509Data.issuer] : [],
          },
        );
        if (improvedOrganizations.length > 0) {
          certificateData.organizations = improvedOrganizations;
        }
      }

      if (x509Data.incCountry !== undefined) {
        const improvedCountries = improve_informations(
          certificateData.countries,
          {
            value: x509Data.incCountry,
            verified: true,
            sources: x509Data.issuer !== undefined ? [x509Data.issuer] : [],
          },
        );
        if (improvedCountries.length > 0) {
          certificateData.countries = improvedCountries;
        }
      }
    }

    return certificateData;
  }
}

function certificate_type_score(type?: CertificateType) {
  if (type === "EV") return 4;
  else if (type === "IV") return 3;
  else if (type === "OV") return 2;
  else if (type === "DV") return 1;
  return 0;
}
