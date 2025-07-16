export type CertificateType = "EV (.onion)" | "EV" | "IV" | "OV" | "DV";

export interface CertificateData {
  organisation?: string;
  country?: string;
  incCountry?: string;
  // https://cabforum.org/working-groups/server/extended-validation/documents/ Section 7.1.4.2.3
  businessCategory?:
    | "Private Organization"
    | "Government Entity"
    | "Business Entity"
    | "Non-Commercial Entity";
  type?: CertificateType;
}
