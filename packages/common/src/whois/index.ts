import { InformationCache } from "../type";
import { user_error } from "../utils/error";
import * as api from "./api";
import * as rdap from "./rdap";

export async function get_data(domain: string, cache: InformationCache) {
  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw user_error("No TLD");

  const api_get_data = api.get_api(tld);

  if (api_get_data !== undefined) {
    return await api_get_data(domain);
  }

  return await rdap.get_data(domain, cache);
}
