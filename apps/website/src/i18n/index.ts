export const locales = ["en", "fr", "nl"];

export function getLocaleFromUrl(url: URL) {
  const pathParts = url.pathname.split("/");
  const locale = pathParts.at(1);

  if (locale !== undefined && locales.includes(locale)) return locale;
  return locales[0];
}

export function getLocalizedPath(locale: string, path: string) {
  if (!locales.includes(locale)) {
    locale = locales[0];
  }

  return `/${locale}/${path.replace(/^\//g, "")}`;
}

export function getUnlocalizedPath(url: URL) {
  const pathParts = url.pathname.split("/");
  const locale = pathParts.at(1);
  const path = pathParts.slice(2).join("/");

  if (locale === undefined) return path;

  if (!locales.includes(locale)) return path;

  return path;
}
