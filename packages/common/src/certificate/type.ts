import { Information } from "../type";

export type CertificateType = "DV" | "IV" | "OV" | "EV";

export type BusinessCategory =
  | "Private Organization"
  | "Government Entity"
  | "Business Entity"
  | "Non-Commercial Entity";

export interface CertificateData {
  types: Information<CertificateType>[];
  individuals: Information<string>[];
  organizations: Information<string>[];
  countries: Information<string>[];
}
