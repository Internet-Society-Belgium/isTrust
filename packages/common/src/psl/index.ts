import { InformationCache } from "../type";
import { parse_tld } from "../utils/domain";
import { source_error } from "../utils/error";

// https://publicsuffix.org/list/
const CACHING_DAYS = 7;

export async function update(cache: InformationCache) {
  let loading = await cache.get("psl:_loading");

  while (loading === "true") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading = await cache.get("psl:_loading");
  }

  const lastUpdate = await cache.get("psl:_lastUpdate");

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
  await cache.set("psl:_loading", "true");

  try {
    await cache.clear("psl:");

    // https://publicsuffix.org/list/
    const res = await fetch(
      "https://publicsuffix.org/list/public_suffix_list.dat",
    );

    if (!res.ok) throw source_error("Public Suffix List not available");

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
        promises.push(cache.set(`psl:${rule}`, ""));
      } catch (e) {
        console.error(e);
      }
    }

    await Promise.allSettled(promises);

    await cache.set("psl:_lastUpdate", new Date().toISOString());
  } catch (e) {
    console.error(e);
  }

  await cache.set("psl:_loading", "false");
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
    const exceptionRuleMatch = await cache.get(`psl:${exceptionRule}`);
    if (exceptionRuleMatch !== undefined) {
      return eDomain;
    }

    if (l < labels.length - 1) {
      const wildcardRule = `*.${labels.slice(l + 1).join(".")}`;
      const wildcardRuleMatch = await cache.get(`psl:${wildcardRule}`);
      if (wildcardRuleMatch !== undefined) {
        return eDomain;
      }
    }

    const rule = labels.slice(l).join(".");
    const ruleMatch = await cache.get(`psl:${rule}`);
    if (ruleMatch !== undefined) {
      return eDomain;
    }
  }

  return domain;
}
