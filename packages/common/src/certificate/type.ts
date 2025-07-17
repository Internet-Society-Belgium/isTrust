export type CertificateType = "DV" | "IV" | "OV" | "EV";

export type BusinessCategory =
  | "Private Organization"
  | "Government Entity"
  | "Business Entity"
  | "Non-Commercial Entity";

export interface CertificateData {
  type?: CertificateType[];
  individual?: string[];
  organization?: string[];
  country?: string[];
  businessCategory?: BusinessCategory[];
}
