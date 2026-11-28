import { CertificateType } from "../type";

export interface X509Issuer {
  organization: string;
  country?: string;
  links: string[];
}

export interface X509Data {
  type: CertificateType;
  issuer?: X509Issuer;
  // The given name and the surname, each as its own name.
  individualNames?: string[];
  // Display name, with the OU suffix when present.
  organization?: string;
  // Raw subject O, without the OU suffix.
  owner?: string;
  country?: string;
  incCountry?: string;
}
