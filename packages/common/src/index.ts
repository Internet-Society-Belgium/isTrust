import * as _psl from "./psl";
import type { InternalCache } from "./type";
import { isFQDN } from "./utils/validate";
import * as _whois from "./whois";
import type { WHOISData } from "./whois/type";

export { InternalCache, isFQDN };

export async function whois(domain: string, cache: InternalCache) {
  if (!isFQDN(domain)) {
    throw new Error("Invalid domain");
  }

  const eDomain = await _psl.get_effective_domain(domain, cache);

  const data = await _whois.get_data(eDomain);
  if (data === undefined) throw new Error("No whois data");
  return data;
}

export { WHOISData };
