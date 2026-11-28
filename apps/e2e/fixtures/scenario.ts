import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

// A scenario is everything the checks see from the network for one domain:
// the recorded responses of every service they call, plus the DNSSEC answer.
// `npm run record:e2e` writes it from the real services
// (scenarios/<domain>.json); variants change parts of it (fixtures/variants.ts).

export interface RecordedResponse {
  status: number;
  contentType: string;
  /** Text, or base64 when `base64` is true. */
  body: string;
  base64?: boolean;
  /** The request failed at recording time (network error): replayed as one. */
  failed?: boolean;
}

export interface Scenario {
  domain: string;
  /** When it was recorded: the tests freeze the browser clock to it. */
  recorded_at: string;
  /** Whether the DNSSEC-validating resolvers set the AD flag. */
  dnssec: { authenticated: boolean };
  /** Keyed by `<method> <url>`. */
  responses: Partial<Record<string, RecordedResponse>>;
}

const directory = path.join(import.meta.dirname, "../scenarios");

export function scenario_path(domain: string): string {
  return path.join(directory, `${domain}.json`);
}

export function load_scenario(domain: string): Scenario {
  return JSON.parse(readFileSync(scenario_path(domain), "utf8")) as Scenario;
}

export function save_scenario(scenario: Scenario): void {
  const sorted = Object.fromEntries(
    Object.entries(scenario.responses).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(
    scenario_path(scenario.domain),
    `${JSON.stringify({ ...scenario, responses: sorted }, undefined, 2)}\n`,
  );
}

export function response_key(method: string, url: string): string {
  return `${method} ${url}`;
}
