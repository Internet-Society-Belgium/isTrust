import * as doh from "../../utils/doh";
import { source_error } from "../../utils/error";
import { DNSSECData } from "../type";

export async function get_data(domain: string) {
  const data: DNSSECData = {};

  try {
    // https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-wireformat/
    const decoded = await doh.resolve(
      "https://cloudflare-dns.com/dns-query",
      domain,
    );

    // https://datatracker.ietf.org/doc/rfc3655/
    const validity = decoded.flag_ad;
    if (validity === undefined) throw source_error("Missing AD flag");

    data.valid = {
      value: validity,
      sources: [
        {
          organization: "Cloudflare",
          country: "US",
          links: ["https://one.one.one.one/dns/"],
        },
      ],
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from Cloudflare`);
  }

  return data;
}
