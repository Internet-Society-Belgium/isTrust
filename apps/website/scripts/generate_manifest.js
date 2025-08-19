#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import i18n, { translatedLangs } from "@istrust/i18n";

const dirPath = dirname(import.meta.filename);

const localeFolder = join(dirPath, "../public/manifest");

rmSync(localeFolder, {
  recursive: true,
  force: true,
});
mkdirSync(localeFolder, { recursive: true });

for (const translatedLang of translatedLangs) {
  const manifest = {
    name: "isTrust",
    short_name: "isTrust",
    lang: translatedLang,
    description: i18n(
      "Verify the trustworthiness of any website",
      translatedLang,
    ),
    start_url: `/${translatedLang}/`,
    theme_color: "#07f",
    background_color: "#f8fafc",
    display: "standalone",
    share_target: {
      action: `/${translatedLang}/`,
      enctype: "application/x-www-form-urlencoded",
      method: "GET",
      params: { text: "q", url: "q" },
    },
    icons: [
      {
        sizes: "64x64",
        src: "/images/icon-64x64.png",
        type: "image/png",
      },
      {
        sizes: "192x192",
        src: "/images/icon-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/images/icon-512x512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/images/maskable-icon-512x512.png",
        type: "image/png",
      },
    ],
  };

  writeFileSync(
    join(localeFolder, `${translatedLang}.webmanifest`),
    JSON.stringify(manifest),
  );
}
