import { fr } from "./translations/fr";
import { Translated, Translations } from "./types";

// Register new language here
const translations = new Map<string, Translations>().set("fr", fr);

export const translatedLangs = ["en", ...translations.keys().toArray()];

export default function (string: Translated, lang: string, values?: string[]) {
  lang = lang.toLowerCase();

  const translation = translations.get(lang);

  if (translation !== undefined) {
    let translatedString = translation[string];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (translatedString !== undefined) {
      if (values !== undefined) {
        for (const value of values) {
          translatedString = translatedString.replace("#", value);
        }
      }

      return translatedString;
    }
  }

  return string;
}
