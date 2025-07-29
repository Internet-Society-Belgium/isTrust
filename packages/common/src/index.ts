import * as certificate from "./certificate";
import * as dnssec from "./dnssec";
import * as psl from "./psl";
import { merge_data_array, type Data, type DataCache } from "./type";
import { parse_domain } from "./utils/domain";
import * as whois from "./whois";

export type { Data, DataCache };

export { merge_data_array };

export async function get_effective_domain(query: string, cache: DataCache) {
  const domain = parse_domain(query);
  return await psl.get_effective_domain(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: DataCache) {
  return await whois.get_data(eDomain, cache);
}

export async function get_certificate_data(eDomain: string) {
  return await certificate.get_data(eDomain);
}

export async function get_dnssec_data(
  eDomain: string,
  customResolver?: string,
) {
  return await dnssec.get_data(eDomain, customResolver);
}

export async function force_update_cache(cache: DataCache) {
  await Promise.allSettled([psl.load(cache), whois.load(cache)]);
}
