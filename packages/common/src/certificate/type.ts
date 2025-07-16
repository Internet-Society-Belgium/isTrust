export type CertificateType = "DV" | "IV" | "OV" | "EV" | "EV (.onion)";

// https://cabforum.org/working-groups/server/baseline-requirements/documents/
// https://cabforum.org/working-groups/server/extended-validation/documents/
export interface CertificateData {
  type?: CertificateType;
  organisation?: string;
  country?: string;
  businessCategory?:
    | "Private Organization"
    | "Government Entity"
    | "Business Entity"
    | "Non-Commercial Entity";
}
