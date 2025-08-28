import { InformationCache } from "../../type";
import { source_error } from "../../utils/error";
import { PlatformData } from "../type";

// https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/urlshortener-onlydomains.txt
// Expires: 1 day
const CACHING_DAYS = 1;

export async function update(cache: InformationCache) {
  let loading = await cache.get("url_shortner:_loading");

  while (loading === "true") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading = await cache.get("url_shortner:_loading");
  }

  const lastUpdate = await cache.get("url_shortner:_lastUpdate");

  const cachingOutdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (
    lastUpdate === undefined ||
    new Date(lastUpdate).getTime() < cachingOutdated
  ) {
    await load(cache);
  }
}

export async function load(cache: InformationCache) {
  await cache.set("url_shortner:_loading", "true");

  await cache.clear("url_shortner:");

  // https://github.com/hagezi/dns-blocklists#urlshortener
  const res = await fetch(
    "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/urlshortener-onlydomains.txt",
  );

  if (!res.ok) throw source_error("hagezi/dns-blocklists not available");

  const text = await res.text();
  const lines = text.split("\n");

  const promises: Promise<void>[] = [];

  for (let line of lines) {
    line = line.trim();

    if (line === "" || line === "\n" || line.startsWith("#")) continue;

    promises.push(cache.set(`url_shortner:${line}`, ""));
  }

  await Promise.allSettled(promises);

  await cache.set("url_shortner:_lastUpdate", new Date().toISOString());

  await cache.set("url_shortner:_loading", "false");
}

export async function get_data(domain: string, cache: InformationCache) {
  await update(cache);

  const data: PlatformData = {
    platforms: [],
  };

  const labels = domain.split(".");

  for (let l = 0; l < labels.length; l++) {
    const match = await cache.get(`url_shortner:${labels.slice(l).join(".")}`);
    if (match !== undefined) {
      data.platforms = [
        {
          value: "url_shortner",
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
