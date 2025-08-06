import { Information } from "../type";

export interface WHOISData {
  registrations: Information<string>[];
  organizations: Information<string>[];
  individuals: Information<string>[];
  countries: Information<string>[];
}
