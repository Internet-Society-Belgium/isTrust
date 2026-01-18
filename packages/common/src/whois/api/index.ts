import { WHOISData } from "../type";
import * as be from "./be";
import * as nl from "./nl";

const apis = new Map<
  string,
  (domain: string, canBypassCORS: boolean) => Promise<WHOISData>
>()
  .set("be", be.get_data)
  .set("nl", nl.get_data);

export function get_api(tld: string) {
  return apis.get(tld);
}
