import { Information } from "../type";

export type CountryRole = "office" | "incorporated";

export type CountryInformation = Information<string, CountryRole>;
