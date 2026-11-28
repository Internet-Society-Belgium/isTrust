import type { Information } from "../type";
import { ISO_3166_ALPHA_2 } from "./iso3166";

// XK (Kosovo) is not ISO 3166-1, but RDAP, certificates and the .be API use it.
// Accepted on purpose so Kosovar owners are not dropped.
const EXCEPTIONS = ["XK"];

const ALIASES: Record<string, string> = {
  UK: "GB",
};

const CODES = new Set([...ISO_3166_ALPHA_2, ...EXCEPTIONS]);

const NAMES = new Map<string, string>();
const names = new Intl.DisplayNames(["en"], { type: "region" });
for (const code of ISO_3166_ALPHA_2) {
  const name = names.of(code);
  if (name !== undefined && name !== code) {
    NAMES.set(name.toLowerCase(), code);
  }
}

// Returns an ISO alpha-2 code, or undefined for anything else
// (REDACTED, ZZ, EU, A1, empty, ...).
export function normalize_country(value: string | undefined) {
  if (value === undefined) return;

  const trimmed = value.trim();
  if (trimmed === "") return;

  const upper = trimmed.toUpperCase();
  const code = ALIASES[upper] ?? upper;
  if (CODES.has(code)) return code;

  return NAMES.get(trimmed.toLowerCase());
}

// Stable: verified first, then unverified, then the proxy's.
export function sort_countries(
  countries: Information<string>[] | undefined,
  is_proxy: (country: Information<string>) => boolean,
) {
  if (countries === undefined) return;

  const rank = (country: Information<string>) => {
    if (is_proxy(country)) return 2;
    if (country.verified === true) return 0;
    return 1;
  };

  return [...countries].sort((a, b) => rank(a) - rank(b));
}
