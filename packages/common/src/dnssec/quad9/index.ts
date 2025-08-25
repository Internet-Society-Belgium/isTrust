import * as doh from "../../utils/doh";
import { source_error } from "../../utils/error";
import { DNSSECData } from "../type";

export async function get_data(domain: string) {
  const data: DNSSECData = {};

  try {
    // https://docs.quad9.net/services/
    const decoded = await doh.resolve(
      "https://dns12.quad9.net/dns-query",
      domain,
    );

    // https://datatracker.ietf.org/doc/rfc3655/
    const validity = decoded.flag_ad;
    if (validity === undefined) throw source_error("Missing AD flag");

    data.valid = {
      value: validity,
      sources: [
        {
          organization: "Quad9",
          country: "CH",
          links: ["https://quad9.net/"],
        },
      ],
      verified: true,
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Quad9`);
  }

  return data;
}
