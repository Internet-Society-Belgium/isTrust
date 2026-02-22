import { WHOISData } from "../type";
import * as be from "./be";

const apis = new Map<
  string,
  (domain: string, canBypassCORS: boolean) => Promise<WHOISData>
>().set("be", be.get_data);

export function get_api(tld: string) {
  return apis.get(tld);
}
