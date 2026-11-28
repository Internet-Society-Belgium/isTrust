import { Information } from "../type";

export type CountryRole = "office" | "incorporated";

export interface CountryMeta {
  role: CountryRole;
  // Omitted when the owner is not named.
  owner?: string;
}

export type CountryInformation = Information<string, CountryMeta>;
