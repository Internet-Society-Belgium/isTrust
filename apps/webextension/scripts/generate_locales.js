#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import i18n, { translatedLangs } from "@istrust/i18n";

const dirPath = dirname(import.meta.filename);

rmSync(join(dirPath, `../public/_locales`), {
  recursive: true,
  force: true,
});

for (const translatedLang of translatedLangs) {
  const localeFolder = join(dirPath, `../public/_locales/${translatedLang}`);

  mkdirSync(localeFolder, { recursive: true });

  const messages = {
    description: {
      message: i18n(
        "Verify the trustworthiness of any website",
        translatedLang,
      ),
    },
  };

  writeFileSync(join(localeFolder, "messages.json"), JSON.stringify(messages));
}
