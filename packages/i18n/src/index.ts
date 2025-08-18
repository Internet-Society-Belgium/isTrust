import fr from "./translations/fr";
import nl from "./translations/nl";

// Register new language here
const translations = new Map<string, Map<string, string>>()
  .set("fr", fr)
  .set("nl", nl);

export const translatedLangs = ["en", ...translations.keys().toArray()];

export default function (string: string, lang: string, values?: string[]) {
  lang = lang.toLowerCase();

  const translation = translations.get(lang);

  if (translation !== undefined) {
    let translatedString = translation.get(string);

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
