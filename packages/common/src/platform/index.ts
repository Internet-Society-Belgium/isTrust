import { improve_informations, InformationCache } from "../type";
import * as disposable_email from "./disposable_email";
import { PlatformData } from "./type";
import * as url_shortener from "./url_shortener";

export async function get_data(domain: string, cache: InformationCache) {
  const data: PlatformData = {
    platforms: [],
  };

  const disposableEmailPlatform = await disposable_email.get_data(
    domain,
    cache,
  );

  for (const platform of disposableEmailPlatform.platforms) {
    data.platforms = improve_informations(data.platforms, platform);
  }

  const urlShortenerPlatform = await url_shortener.get_data(domain, cache);

  for (const platform of urlShortenerPlatform.platforms) {
    data.platforms = improve_informations(data.platforms, platform);
  }

  return data;
}
