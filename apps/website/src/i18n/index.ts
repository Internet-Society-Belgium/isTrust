import { translatedLangs } from "@istrust/i18n";

export const langs = translatedLangs;

export function getLangFromPath(path: string) {
  const pathParts = path.split("/");
  const lang = pathParts.at(1);

  if (lang !== undefined && langs.includes(lang)) return lang;
  return langs[0];
}

export function getLocalizedPath(lang: string, path: string) {
  if (!langs.includes(lang)) {
    lang = langs[0];
  }

  return `/${lang}/${path.replace(/^\//g, "")}`;
}

export function getUnlocalizedPath(path: string) {
  return path.split("/").slice(2).join("/");
}
