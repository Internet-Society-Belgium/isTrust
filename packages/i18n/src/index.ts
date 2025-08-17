import fr from "./translations/fr";
import nl from "./translations/nl";
import { Translation } from "./type";

// Register new language here
const translations = new Map<string, Map<string, Translation>>()
  .set("fr", fr)
  .set("nl", nl);

export const translatedLangs = ["en", ...translations.keys().toArray()];

export default function (string: string, options?: { lang?: string }) {
  if (options?.lang !== undefined) {
    const lang = options.lang.toLowerCase();

    const translation = translations.get(lang);

    if (translation !== undefined) {
      const translatedString = translation.get(string);

      if (translatedString !== undefined) return translatedString;
    }
  }

  return string;
}
