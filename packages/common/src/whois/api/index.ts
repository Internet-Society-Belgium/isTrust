import { user_error } from "../../utils/error";
import * as be from "./be";

export async function get_data(domain: string) {
  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw user_error("No TLD");

  if (tld === "be") {
    return await be.get_data(domain);
  }

  return;
}
