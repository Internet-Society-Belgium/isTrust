import { CertificateType } from "../type";

export interface X509Issuer {
  organization: string;
  country?: string;
  links: string[];
}

export interface X509Data {
  type: CertificateType;
  issuer?: X509Issuer;
  individual?: string;
  organization?: string;
  country?: string;
  incCountry?: string;
}
