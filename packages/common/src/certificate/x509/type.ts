import { BusinessCategory, CertificateType } from "../type";

export interface X509Data {
  type?: CertificateType;
  individual?: string;
  organization?: string;
  country?: string;
  businessCategory?: BusinessCategory;
}
