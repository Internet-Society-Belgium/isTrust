export type CertificateType = "EV (.onion)" | "EV" | "IV" | "OV" | "DV";

export interface CertificateData {
  organisation?: string;
  country?: string;
  businessCategory?: string;
  incCountry?: string;
  type?: CertificateType;
}
