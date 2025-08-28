import { InformationCache } from "../../type";
import {
  out_of_date,
  releaseMutex,
  updated,
  waitMutex,
} from "../../utils/cache";
import { source_error } from "../../utils/error";
import { PlatformData } from "../type";

// https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/urlshortener-onlydomains.txt
// Expires: 1 day
const CACHING_DAYS = 1;

const MUTEX_KEY = "url_shortener#loading";
const LAST_UPDATE_KEY = "url_shortener#lastUpdate";
const PREFIX = "url_shortener:";

export async function update(cache: InformationCache) {
  await waitMutex(cache, MUTEX_KEY);

  if (await out_of_date(cache, LAST_UPDATE_KEY, CACHING_DAYS)) {
    try {
      // https://github.com/hagezi/dns-blocklists#urlshortener
      const res = await fetch(
        "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/urlshortener-onlydomains.txt",
      );

      if (!res.ok) throw source_error("hagezi/dns-blocklists not available");

      await cache.clear(PREFIX);

      const text = await res.text();
      const lines = text.split("\n");

      const promises: Promise<void>[] = [];

      for (let line of lines) {
        line = line.trim();

        if (line === "" || line === "\n" || line.startsWith("#")) continue;

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
          value: "url_shortener",
          sources: [
            {
              organization: "HaGeZi's Blocklist URL Shortener",
              links: ["https://github.com/hagezi/dns-blocklists"],
            },
          ],
        },
      ];

      break;
    }
  }

  return data;
}
