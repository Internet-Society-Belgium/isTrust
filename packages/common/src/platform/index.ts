import { improve_informations, InformationCache } from "../type";
import * as disposable_email from "./disposable_email";
import { PlatformData } from "./type";

export async function get_data(domain: string, cache: InformationCache) {
  const data: PlatformData = {
    platforms: [],
  };

  const disposableEmailPlatform = await disposable_email.get_data(
    domain,
    cache,
  );

  let improvedPlatform: typeof data.platforms = [];
  for (const platform of disposableEmailPlatform.platforms) {
    improvedPlatform = improve_informations(data.platforms, platform);
  }

  data.platforms = improvedPlatform;

  return data;
}
