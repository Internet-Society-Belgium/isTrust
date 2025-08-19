import { fr } from "./translations/fr";
import { Translated, Translations } from "./types";

// Register new language here
const translations = new Map<string, Translations>().set("fr", fr);

export const translatedLangs = ["en", ...translations.keys().toArray()];

export default function (string: Translated, lang: string, values?: string[]) {
  let translatedString: string | undefined;

  lang = lang.toLowerCase();

  const translation = translations.get(lang);

  if (translation !== undefined) {
    translatedString = translation[string];
  }

  if (translatedString === undefined) {
    translatedString = string;
  }

  if (values !== undefined) {
    for (const value of values) {
      translatedString = translatedString.replace("#", value);
    }
  } else {
    translatedString = translatedString.replaceAll("#", "");
  }

  return translatedString;
}
