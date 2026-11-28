import { InformationCache } from "../type";
import { out_of_date, releaseMutex, updated, waitMutex } from "../utils/cache";
import { source_error } from "../utils/error";
import type { WHOISData } from "../whois/type";
import { validate_whois_proxy, validate_whois_proxy_patterns } from "./type";

const CACHING_DAYS = 30;

const MUTEX_KEY = "whois_proxy#loading";
const LAST_UPDATE_KEY = "whois_proxy#lastUpdate";
const DATA_KEY = "whois_proxy";

export async function update(cache: InformationCache) {
  await waitMutex(cache, MUTEX_KEY);

  if (await out_of_date(cache, LAST_UPDATE_KEY, CACHING_DAYS)) {
    try {
      // https://github.com/Internet-Society-Belgium/whois-proxy
      const res = await fetch(
        "https://raw.githubusercontent.com/Internet-Society-Belgium/whois-proxy/main/proxy.json",
      );

      if (!res.ok)
        throw source_error(
          "Internet-Society-Belgium/whois-proxy not available",
        );

      const json: unknown = await res.json();
      const whoisProxy = validate_whois_proxy(json);

      const patterns: string[] = [];

      for (const proxy of whoisProxy) {
        for (const pattern of proxy.pattern) {
          patterns.push(pattern);
        }
      }

      const data = JSON.stringify(patterns);

      await cache.clear(DATA_KEY);
      await cache.set(DATA_KEY, data);

      await updated(cache, LAST_UPDATE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  await releaseMutex(cache, MUTEX_KEY);
}

export async function is_proxy(name: string, cache: InformationCache) {
  name = name.trim();
  name = name.replaceAll(/[^a-zA-Z0-9\s.,/\\()-]/g, "");

  await update(cache);

  const data = await cache.get(DATA_KEY);

  if (data === undefined) return false;

  const json: unknown = JSON.parse(data);
  const whoisProxyPatterns = validate_whois_proxy_patterns(json);

  for (const pattern of whoisProxyPatterns) {
    if (new RegExp(pattern, "i").test(name)) {
      return true;
    }
  }

  return false;
}

// The whois owner is a proxy service: its organization, or its name when it
// has no organization, matches the proxy list.
export async function is_proxy_owner(
  whois: Pick<WHOISData, "organizations" | "individuals">,
  cache: InformationCache,
) {
  const owners =
    whois.organizations.length > 0 ? whois.organizations : whois.individuals;

  const results = await Promise.all(
    owners.map((owner) => is_proxy(owner.value, cache)),
  );
  return results.some((result) => result);
}
