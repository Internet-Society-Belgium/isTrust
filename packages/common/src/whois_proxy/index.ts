import { InformationCache } from "../type";
import { out_of_date, releaseMutex, updated, waitMutex } from "../utils/cache";
import { source_error } from "../utils/error";

const CACHING_DAYS = 1;

const MUTEX_KEY = "whois_proxy#loading";
const LAST_UPDATE_KEY = "whois_proxy#lastUpdate";
const PREFIX = "whois_proxy:";

export async function update(cache: InformationCache) {
  await waitMutex(cache, MUTEX_KEY);

  if (await out_of_date(cache, LAST_UPDATE_KEY, CACHING_DAYS)) {
    try {
      // https://github.com/Internet-Society-Belgium/whois-proxy
      const res = await fetch(
        "https://raw.githubusercontent.com/Internet-Society-Belgium/whois-proxy/main/proxy.txt",
      );

      if (!res.ok)
        throw source_error(
          "Internet-Society-Belgium/whois-proxy not available",
        );

      await cache.clear(PREFIX);

      const text = await res.text();
      const lines = text.split("\n");

      const promises: Promise<void>[] = [];

      let domain: string | undefined;

      for (let line of lines) {
        line = line.trim();

        if (line === "" || line === "\n") {
          domain = undefined;
          continue;
        }

        if (line.startsWith("#")) {
          domain = line.slice(1).trim();
          continue;
        }

        const key = encode(line);

        promises.push(
          cache.set(`${PREFIX}${key}`, domain !== undefined ? domain : ""),
        );
      }

      await Promise.allSettled(promises);

      await updated(cache, LAST_UPDATE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  await releaseMutex(cache, MUTEX_KEY);
}

export async function is_proxy(
  name: string,
  cache: InformationCache,
  domain?: string,
) {
  await update(cache);

  const key = encode(name);

  const match = await cache.get(`${PREFIX}${key}`);

  if (match === undefined) return false;

  if (match !== "" && domain !== undefined && domain.endsWith(match)) {
    return false;
  }

  return true;
}

function encode(value: string) {
  value = value.toLowerCase();
  value = value.replaceAll(/[^a-zA-Z0-9 ]/g, "");
  return value;
}
