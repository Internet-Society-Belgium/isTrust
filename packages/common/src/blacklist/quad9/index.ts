import { BlacklistData } from "../type";
import { validate_response } from "./type";

export async function get_data(domain: string) {
  let data: BlacklistData = {};

  try {
    const res = await fetch(`https://api.quad9.net/search/${domain}`);

    const json: unknown = await res.json();

    const response = validate_response(json);

    const blocked = response.blocked;

    data = {
      blocked: {
        value: blocked,
        sources: [
          {
            organization: "Quad9",
            country: "CH",
            links: ["https://quad9.net/"],
          },
        ],
        verified: true,
      },
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Quad9`);
  }

  return data;
}
