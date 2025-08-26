import * as cloudflare from "./cloudflare";
import * as quad9 from "./quad9";
import { DNSSECData } from "./type";

export async function get_data(domain: string, cors: boolean = false) {
  let data: DNSSECData = {};

  if (cors) {
    data = await quad9.get_data(domain);

    if (data.valid !== undefined) return data;
  }

  data = await cloudflare.get_data(domain);

  return data;
}
