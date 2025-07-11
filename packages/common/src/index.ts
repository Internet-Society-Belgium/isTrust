import isFQDN from "validator/es/lib/isFQDN";
import * as _psl from "./psl";
import type { InternalCache } from "./type";
import * as _whois from "./whois";
import type { WHOISData } from "./whois/type";

export { InternalCache };

export async function whois(domain: string, cache: InternalCache) {
  if (!isFQDN(domain)) {
    throw new Error("Invalid domain");
  }

  await _psl.update(cache);
  const eDomain = await _psl.get_effective_domain(domain, cache);

  const data = await _whois.get(eDomain);
  if (data === undefined) throw new Error("No whois data");
  return data;
}

export { WHOISData };
