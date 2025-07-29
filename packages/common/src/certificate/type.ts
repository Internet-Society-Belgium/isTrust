import { Data } from "../type";

export type CertificateType = "DV" | "IV" | "OV" | "EV";

export type BusinessCategory =
  | "Private Organization"
  | "Government Entity"
  | "Business Entity"
  | "Non-Commercial Entity";

export interface CertificateData {
  types: Data<CertificateType>[] | null;
  individuals: Data<string>[] | null;
  organizations: Data<string>[] | null;
  countries: Data<string>[] | null;
}
