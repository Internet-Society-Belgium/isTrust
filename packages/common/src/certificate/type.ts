import { Data } from "../type";

export type CertificateType = "DV" | "IV" | "OV" | "EV";

export type BusinessCategory =
  | "Private Organization"
  | "Government Entity"
  | "Business Entity"
  | "Non-Commercial Entity";

export interface CertificateData {
  types?: Data<CertificateType>[];
  individuals?: Data<string>[];
  organizations?: Data<string>[];
  countries?: Data<string>[];
  businessCategories?: Data<BusinessCategory>[];
}
