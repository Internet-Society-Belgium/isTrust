import * as quad9 from "./quad9";
import { BlacklistData } from "./type";

export async function get_data(domain: string, cors: boolean = false) {
  let data: BlacklistData = {};

  data = await quad9.get_data(domain);

  return data;
}
