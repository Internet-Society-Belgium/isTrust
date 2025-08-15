import { InformationCache } from "../type";
import { user_error } from "../utils/error";
import * as api from "./api";
import * as rdap from "./rdap";
import { WHOISData } from "./type";

export async function get_data(domain: string, cache: InformationCache) {
  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw user_error("No TLD");

  let data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };

  const api_get_data = api.get_api(tld);

  if (api_get_data !== undefined) {
    try {
      return await api_get_data(domain);
    } catch (e) {
      const error = e as Error;
      console.error(`${error.message} from API`);
    }
  }

  try {
    data = await rdap.get_data(domain, cache);
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from RDAP`);
  }

  return data;
}
