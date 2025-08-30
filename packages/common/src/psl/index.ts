import { InformationCache } from "../type";
import { out_of_date, releaseMutex, updated, waitMutex } from "../utils/cache";
import { parse_tld } from "../utils/domain";
import { source_error } from "../utils/error";

// https://publicsuffix.org/list/
const CACHING_DAYS = 7;

const MUTEX_KEY = "psl#loading";
const LAST_UPDATE_KEY = "psl#lastUpdate";
const PREFIX = "psl:";

export async function update(cache: InformationCache) {
  await waitMutex(cache, MUTEX_KEY);

  if (await out_of_date(cache, LAST_UPDATE_KEY, CACHING_DAYS)) {
    try {
      // https://publicsuffix.org/list/
      const res = await fetch(
        "https://publicsuffix.org/list/public_suffix_list.dat",
      );

      if (!res.ok) throw source_error("Public Suffix List not available");

      await cache.clear(PREFIX);

      const text = await res.text();
      const lines = text.split("\n");

      const promises: Promise<void>[] = [];

      for (let line of lines) {
        line = line.trim();

        if (line === "" || line === "\n" || line.startsWith("//")) continue;

        let prefix = "";
        let tld = line;
        if (line.startsWith("!")) {
          prefix = "!";
          tld = line.substring(1);
        } else if (line.startsWith("*.")) {
          prefix = "*.";
          tld = line.substring(2);
        }

        try {
          tld = parse_tld(tld);

          const rule = `${prefix}${tld}`;
          promises.push(cache.set(`${PREFIX}${rule}`, ""));
        } catch (e) {
          console.error(e);
        }
      }

      await Promise.allSettled(promises);

      await updated(cache, LAST_UPDATE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  await releaseMutex(cache, MUTEX_KEY);
}

// https://github.com/publicsuffix/list/wiki/Format#algorithm
export async function get_effective_domain(
  domain: string,
  cache: InformationCache,
) {
  await update(cache);

  const labels = domain.split(".");

  for (let l = 0; l < labels.length; l++) {
    const eDomain = labels.slice(l === 0 ? 0 : l - 1).join(".");

    const exceptionRule = `!${labels.slice(l).join(".")}`;
    const exceptionRuleMatch = await cache.get(`${PREFIX}${exceptionRule}`);
    if (exceptionRuleMatch !== undefined) {
      return eDomain;
    }

    if (l < labels.length - 1) {
      const wildcardRule = `*.${labels.slice(l + 1).join(".")}`;
      const wildcardRuleMatch = await cache.get(`${PREFIX}${wildcardRule}`);
      if (wildcardRuleMatch !== undefined) {
        return eDomain;
      }
    }

    const rule = labels.slice(l).join(".");
    const ruleMatch = await cache.get(`${PREFIX}${rule}`);
    if (ruleMatch !== undefined) {
      return eDomain;
    }
  }

  return domain;
}
