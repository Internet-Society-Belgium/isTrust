import { DataCache } from "../type";
import { parse_tld } from "../utils/domain";

// https://publicsuffix.org/list/
const CACHING_DAYS = 7;

async function update(cache: DataCache) {
  const lastUpdate = await cache.psl.get("_lastUpdate");

  const cachingOutdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (lastUpdate === null || new Date(lastUpdate).getTime() < cachingOutdated) {
    await load(cache);
  }
}

export async function load(cache: DataCache) {
  await cache.psl.clear();

  // https://publicsuffix.org/list/
  const res = await fetch(
    "https://publicsuffix.org/list/public_suffix_list.dat",
  );

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
      promises.push(cache.psl.set(rule, ""));
    } catch (e) {
      console.error(e);
    }
  }

  await Promise.allSettled(promises);

  await cache.psl.set("_lastUpdate", new Date().toISOString());
}

// https://github.com/publicsuffix/list/wiki/Format#algorithm
export async function get_effective_domain(domain: string, cache: DataCache) {
  await update(cache);

  const labels = domain.split(".");

  for (let l = 0; l < labels.length; l++) {
    const eDomain = labels.slice(l === 0 ? 0 : l - 1).join(".");

    const exceptionRule = `!${labels.slice(l).join(".")}`;
    const exceptionRuleMatch = await cache.psl.get(exceptionRule);
    if (exceptionRuleMatch !== null) {
      return eDomain;
    }

    if (l < labels.length - 1) {
      const wildcardRule = `*.${labels.slice(l + 1).join(".")}`;
      const wildcardRuleMatch = await cache.psl.get(wildcardRule);
      if (wildcardRuleMatch !== null) {
        return eDomain;
      }
    }

    const rule = labels.slice(l).join(".");
    const ruleMatch = await cache.psl.get(rule);
    if (ruleMatch !== null) {
      return eDomain;
    }
  }

  return domain;
}
