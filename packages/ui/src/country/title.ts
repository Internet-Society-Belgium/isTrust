import type { CountryRole } from "@istrust/common";

// Hover text for a country row: optional warning, the country name, then one
// line per role.
export function country_title(
  name: string,
  meta: CountryRole[] | undefined,
  labels: Record<CountryRole, string>,
  warning?: string,
) {
  return [
    ...(warning !== undefined ? [warning] : []),
    name,
    ...(meta ?? []).map((role) => labels[role]),
  ].join("\n");
}
