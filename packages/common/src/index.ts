import * as _psl from "./psl";
import type { InternalCache } from "./type";
import { parse_domain } from "./utils/validate";
import * as _whois from "./whois";
import type { WHOISData } from "./whois/type";

export { InternalCache, parse_domain as isFQDN };

export async function whois(domain: string, cache: InternalCache) {
  domain = parse_domain(domain);

  const eDomain = await _psl.get_effective_domain(domain, cache);

  const data = await _whois.get_data(eDomain);
  if (data === undefined) throw new Error("No whois data");
  return data;
}

export { WHOISData };
