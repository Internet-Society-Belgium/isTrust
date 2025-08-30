import * as blacklist from "./blacklist";
import * as certificate from "./certificate";
import * as dnssec from "./dnssec";
import * as platform from "./platform";
import * as disposableEmail from "./platform/disposable_email";
import { Platform } from "./platform/type";
import * as urlShortener from "./platform/url_shortener";
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

export type { Information, InformationCache, ErrorType, Platform };

export { merge_informations };

export async function get_domain(query: string, cache: InformationCache) {
  const full = parse_domain(query);

  const effective = await psl.get_effective_domain(full, cache);

  return {
    full,
    effective,
  };
}

export async function get_blacklist_data(domain: string) {
  return await blacklist.get_data(domain);
}

export async function get_platform_data(
  domain: string,
  cache: InformationCache,
) {
  return await platform.get_data(domain, cache);
}

export async function get_whois_data(eDomain: string, cache: InformationCache) {
  return await whois.get_data(eDomain, cache);
}

export async function get_certificate_data(eDomain: string) {
  return await certificate.get_data(eDomain);
}

export async function get_dnssec_data(eDomain: string, cors?: boolean) {
  return await dnssec.get_data(eDomain, cors);
}

export async function update_cache(cache: InformationCache) {
  await Promise.allSettled([
    disposableEmail.update(cache),
    urlShortener.update(cache),
    psl.update(cache),
    rdap.update(cache),
  ]);
}
