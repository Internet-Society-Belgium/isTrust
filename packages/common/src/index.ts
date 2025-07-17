import * as certificate from "./certificate";
import * as dnssec from "./dnssec";
import * as psl from "./psl";
import type { DataCache } from "./type";
import { parse_domain } from "./utils/domain";
import * as whois from "./whois";

export { DataCache as InternalCache };

export async function get_effective_domain(query: string, cache: DataCache) {
  const domain = parse_domain(query);
  if (domain === undefined) return;
  return await psl.get_effective_domain(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: DataCache) {
  return await whois.get_data(eDomain, cache);
}

export async function get_certificate_data(eDomain: string) {
  return await certificate.get_data(eDomain);
}

export async function is_dnssec_valid(eDomain: string, resolver?: string) {
  return await dnssec.is_valid(eDomain, resolver);
}

export async function update_cache(cache: DataCache) {
  await Promise.allSettled([psl.update(cache), whois.update(cache)]);
}

export async function force_update_cache(cache: DataCache) {
  await Promise.allSettled([psl.load(cache), whois.load(cache)]);
}
