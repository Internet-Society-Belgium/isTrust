import * as _dnssec from "./dnssec";
import * as _psl from "./psl";
import type { InternalCache } from "./type";
import { parse_domain } from "./utils/domain";
import * as _whois from "./whois";
import type { WHOISData } from "./whois/type";

export { InternalCache };

export async function get_domain(query: string, cache: InternalCache) {
  const domain = parse_domain(query);
  if (domain === undefined) return;
  return await _psl.get_effective_domain(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: InternalCache) {
  const data = await _whois.get_data(eDomain, cache);
  if (data === undefined) throw new Error("No WHOIS data");
  return data;
}

export async function is_dnssec_valid(eDomain: string, resolver?: string) {
  const data = await _dnssec.isValid(eDomain, resolver);
  if (data === undefined) throw new Error("No DNSSEC data");
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
