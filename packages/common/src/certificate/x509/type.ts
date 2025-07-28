import { BusinessCategory, CertificateType } from "../type";

export interface X509Issuer {
  organization: string | null;
  country: string | null;
  links: string[] | null;
}

export interface X509Data {
  type: CertificateType;
  issuer: X509Issuer;
  individual: string | null;
  organization: string | null;
  country: string | null;
  incCountry: string | null;
  businessCategory: BusinessCategory | null;
}
