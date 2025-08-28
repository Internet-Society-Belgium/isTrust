import { InformationCache } from "../../type";
import {
  out_of_date,
  releaseMutex,
  updated,
  waitMutex,
} from "../../utils/cache";
import { source_error } from "../../utils/error";
import { PlatformData } from "../type";

// https://github.com/disposable/disposable-email-domains
// daily update
const CACHING_DAYS = 1;

const MUTEX_KEY = "disposable_email#loading";
const LAST_UPDATE_KEY = "disposable_email#lastUpdate";
const PREFIX = "disposable_email:";

export async function update(cache: InformationCache) {
  await waitMutex(cache, MUTEX_KEY);

  if (await out_of_date(cache, LAST_UPDATE_KEY, CACHING_DAYS)) {
    try {
      // https://github.com/disposable/disposable-email-domains
      const res = await fetch(
        "https://disposable.github.io/disposable-email-domains/domains_mx.txt",
      );

      if (!res.ok) throw source_error("disposable-email-domains not available");

      await cache.clear(PREFIX);
      const text = await res.text();
      const lines = text.split("\n");

      const promises: Promise<void>[] = [];

      for (const line of lines) {
        promises.push(cache.set(`${PREFIX}${line}`, ""));
      }

      await Promise.allSettled(promises);

      await updated(cache, LAST_UPDATE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  await releaseMutex(cache, MUTEX_KEY);
}

export async function get_data(domain: string, cache: InformationCache) {
  await update(cache);

  const data: PlatformData = {
    platforms: [],
  };

  const labels = domain.split(".");

  for (let l = 0; l < labels.length; l++) {
    const match = await cache.get(`${PREFIX}${labels.slice(l).join(".")}`);
    if (match !== undefined) {
      data.platforms = [
        {
          value: "disposable_email",
          sources: [
            {
              organization: "Disposable email domains",
              links: ["https://github.com/disposable/disposable"],
            },
          ],
        },
      ];

      break;
    }
  }

  return data;
}
