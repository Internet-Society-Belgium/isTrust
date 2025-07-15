import * as _certificate from "./certificate";
import * as _dnssec from "./dnssec";
import * as _psl from "./psl";
import type { DataCache } from "./type";
import { parse_domain } from "./utils/domain";
import * as _whois from "./whois";

export { DataCache as InternalCache };

export async function get_effective_domain(query: string, cache: DataCache) {
  const domain = parse_domain(query);
  if (domain === undefined) return;
  return await _psl.get_effective_domain(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: DataCache) {
  return await _whois.get_data(eDomain, cache);
}

export async function get_certificate_data(eDomain: string) {
  return await _certificate.get_data(eDomain);
}

export async function is_dnssec_valid(eDomain: string, resolver?: string) {
  return await _dnssec.isValid(eDomain, resolver);
}

export function update_cache(cache: DataCache) {
  _psl.update(cache);
  _whois.update(cache);
}

export function force_update_cache(cache: DataCache) {
  _psl.load(cache);
  _whois.load(cache);
}
