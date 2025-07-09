import isFQDN from "validator/es/lib/isFQDN";
import * as whoisData from "./whois";
import * as whoisDataType from "./whois/type";

export type WHOISData = whoisDataType.WHOISData;
export async function whois(domain: string) {
  if (!isFQDN(domain)) {
    throw new Error("Invalid domain");
  }

  const data = await whoisData.get(domain);
  if (data === undefined) throw new Error("No whois data");
  return data;
}
