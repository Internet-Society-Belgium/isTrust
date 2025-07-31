import { CertificateType } from "../type";

export interface X509Issuer {
  organization: string;
  country: string | null;
  links: string[] | null;
}

export interface X509Data {
  type: CertificateType;
  issuer: X509Issuer | null;
  individual: string | null;
  organization: string | null;
  country: string | null;
  incCountry: string | null;
}
