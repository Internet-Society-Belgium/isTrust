#!/usr/bin/env node
import { globSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const dirPath = dirname(import.meta.filename);

const apps_scripts_js = globSync(
  join(dirPath, "../../../apps/**/scripts/*.js"),
);
const apps_ts = globSync(join(dirPath, "../../../apps/*/src/**/*.ts"));
const apps_tsx = globSync(join(dirPath, "../../../apps/*/src/**/*.tsx"));
const website_astro = globSync(
  join(dirPath, "../../../apps/website/src/**/*.astro"),
);
const common_ts = globSync(join(dirPath, "../../common/**/*.ts"));
const ui_tsx = globSync(join(dirPath, "../../ui/**/*.tsx"));

/** @type {Set<string>} */
const strings = new Set();

for (const file of [
  ...apps_scripts_js,
  ...apps_ts,
  ...apps_tsx,
  ...website_astro,
  ...common_ts,
  ...ui_tsx,
]) {
  if (file.endsWith(".test.ts") || file.endsWith(".d.ts")) {
    continue;
  }

  const lines = readFileSync(file, "utf-8");
  const matches = lines.matchAll(/i18n\([\s\n]*"(.*)",/g);

  for (const match of matches) {
    const text = match.at(1);

    if (text !== undefined) {
      strings.add(text);
    }
  }
}

const outputPath = join(dirPath, "../src/types.ts");
let output =
  "export type Translations = Record<Translated, string>;\n\nexport type Translated =";

for (const string of Array.from(strings.values()).sort()) {
  output += `\n  | "${string}"`;
}

output += ";\n";

writeFileSync(outputPath, output);
