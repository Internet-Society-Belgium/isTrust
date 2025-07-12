import { WHOISData } from "./type";

export async function get_data(domain: string) {
  const data: WHOISData = {
    domain,
  };

  return data;
}
