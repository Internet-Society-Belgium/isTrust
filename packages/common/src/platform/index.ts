import { improve_informations, InformationCache } from "../type";
import * as disposable_email from "./disposable_email";
import { PlatformData } from "./type";
import * as url_shortner from "./url_shortner";

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

  const urlShortnerPlatform = await url_shortner.get_data(domain, cache);

  for (const platform of urlShortnerPlatform.platforms) {
    data.platforms = improve_informations(data.platforms, platform);
  }

  return data;
}
