import * as certificate from "./certificate";
import * as dnssec from "./dnssec";
import * as psl from "./psl";
import {
  merge_informations,
  type Information,
  type InformationCache,
} from "./type";
import { parse_domain } from "./utils/domain";
import { ErrorType } from "./utils/error";
import * as whois from "./whois";
import * as rdap from "./whois/rdap";

export type { Information, InformationCache, ErrorType };

export { merge_informations };

export async function get_effective_domain(
  query: string,
  cache: InformationCache,
) {
  const domain = parse_domain(query);
  return await psl.get_effective_domain(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: InformationCache) {
  return await whois.get_data(eDomain, cache);
}

export async function get_certificate_data(eDomain: string) {
  return await certificate.get_data(eDomain);
}

export async function get_dnssec_data(eDomain: string) {
  return await dnssec.get_data(eDomain);
}

export async function update_cache(cache: InformationCache) {
  await Promise.allSettled([psl.update(cache), rdap.update(cache)]);
}

export async function force_update_cache(cache: InformationCache) {
  await Promise.allSettled([psl.load(cache), rdap.load(cache)]);
}
