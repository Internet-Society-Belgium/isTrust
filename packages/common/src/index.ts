import * as _psl from "./psl";
import type { InternalCache } from "./type";
import { parse_domain } from "./utils/domain";
import * as _whois from "./whois";
import type { WHOISData } from "./whois/type";

export { InternalCache, parse_domain };

export async function whois(domain: string, cache: InternalCache) {
  domain = parse_domain(domain);

  const eDomain = await _psl.get_effective_domain(domain, cache);

  const data = await _whois.get_data(eDomain, cache);
  if (data === undefined) throw new Error("No WHOIS data");
  return data;
}

export { WHOISData };

export function update_cache(cache: InternalCache) {
  _psl.update(cache);
  _whois.update(cache);
}

export function force_update_cache(cache: InternalCache) {
  _psl.load(cache);
  _whois.load(cache);
}
