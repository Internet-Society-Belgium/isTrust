import { WHOISData } from "./type";

export async function get(domain: string) {
  const data: WHOISData = {
    domain,
  };

  return data;
}
