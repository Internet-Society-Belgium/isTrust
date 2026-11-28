import type { CountryMeta, CountryRole } from "@istrust/common";

// Hover text for a country row: optional warning, the country name, then one
// line per meta entry.
export function country_title(
  name: string,
  meta: CountryMeta[] | undefined,
  labels: Record<CountryRole, string>,
  warning?: string,
) {
  const lines: string[] = [];

  if (warning !== undefined) lines.push(warning);

  lines.push(name);

  for (const entry of meta ?? []) {
    const label = labels[entry.role];
    lines.push(entry.owner === undefined ? label : `${label}: ${entry.owner}`);
  }

  return lines.join("\n");
}
