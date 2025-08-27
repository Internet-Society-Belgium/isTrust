import { Source } from "../../type";
import { BlacklistData } from "../type";
import { validate_meta, validate_response } from "./type";

export async function get_data(domain: string) {
  const data: BlacklistData = {};

  try {
    const res = await fetch(`https://api.quad9.net/search/${domain}`);

    const json: unknown = await res.json();

    const response = validate_response(json);

    const blocked = response.blocked;

    const sources: Source[] = [];
    try {
      const response = validate_meta(json);

      for (const meta of response.meta) {
        sources.push({
          organization: meta.name,
          links: meta.url !== undefined ? [meta.url] : [],
        });
      }
    } catch {
      sources.push({
        organization: "Quad9",
        country: "CH",
        links: ["https://quad9.net/service/threat-blocking/"],
      });
    }

    data.blocked = {
      value: blocked,
      sources,
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Quad9`);
  }

  return data;
}
