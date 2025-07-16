export type CertificateType = "DV" | "IV" | "OV" | "EV" | "EV (.onion)";

// https://cabforum.org/working-groups/server/baseline-requirements/documents/
// https://cabforum.org/working-groups/server/extended-validation/documents/
export interface CertificateData {
  organisation?: string;
  countryCode?: string;
  incCountryCode?: string;
  businessCategory?:
    | "Private Organization"
    | "Government Entity"
    | "Business Entity"
    | "Non-Commercial Entity";
  type?: CertificateType;
}
