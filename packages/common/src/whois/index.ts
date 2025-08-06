import { InformationCache } from "../type";
import { feature_error, user_error } from "../utils/error";
import * as api from "./api";
import * as rdap from "./rdap";

export async function get_data(domain: string, cache: InformationCache) {
  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw user_error("No TLD");

  let data;

  try {
    data = await api.get_data(domain);
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from API`);
  }

  if (data !== undefined) return data;

  try {
    data = await rdap.get_data(domain, cache);
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from RDAP`);
  }

  if (data !== undefined) return data;

  throw feature_error(`No source available for .${tld}`);
}
