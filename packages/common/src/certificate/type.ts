export type CertificateType = "DV" | "IV" | "OV" | "EV";

export interface CertificateData {
  type?: CertificateType;
  individual?: string;
  organisation?: string;
  country?: string;
  businessCategory?:
    | "Private Organization"
    | "Government Entity"
    | "Business Entity"
    | "Non-Commercial Entity";
}
