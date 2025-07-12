import { InternalCache } from "../type";

// https://publicsuffix.org/list/
const CACHING_DAYS = 7;

export async function update(cache: InternalCache) {
  const lastUpdate = await cache.psl.get("_lastUpdate");

  const caching_outdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (
    lastUpdate === null ||
    new Date(lastUpdate).getTime() < caching_outdated
  ) {
    await cache.psl.flush();
    await load(cache);
    await cache.psl.set("_lastUpdate", Date.now().toString());
  }
}

async function load(cache: InternalCache) {
  const res = await fetch(
    "https://publicsuffix.org/list/public_suffix_list.dat",
    { cache: "no-cache" },
  );

  const text = await res.text();
  const lines = text.split("\n");

  const promises: Promise<void>[] = [];

  for (let line of lines) {
    line = line.trim();

    if (line === "" || line === "\n" || line.startsWith("//")) continue;

    let prefix = "";
    let domain = line;
    if (line.startsWith("!")) {
      prefix = "!";
      domain = line.substring(1);
    } else if (line.startsWith("*.")) {
      prefix = "*.";
      domain = line.substring(2);
    }

    const url = new URL(`https://${domain}`);
    const rule = `${prefix}${url.hostname}`;
    promises.push(cache.psl.set(rule, ""));
  }

  await Promise.allSettled(promises);
}

// https://github.com/publicsuffix/list/wiki/Format#algorithm
export async function get_effective_domain(
  domain: string,
  cache: InternalCache,
) {
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

    const rule = `${labels.slice(l).join(".")}`;
    const ruleMatch = await cache.psl.get(rule);
    if (ruleMatch !== null) {
      return eDomain;
    }
  }

  return domain;
}
