import { source_error } from "../utils/error";
import { DNSSECData, validate_dns_response } from "./type";

const RESOLVER = {
  url: "https://cloudflare-dns.com/dns-query",
  name: "Cloudflare",
  country: "US",
  links: ["https://one.one.one.one/dns/"],
};

export async function get_data(domain: string) {
  const data: DNSSECData = {};

  try {
    // https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/
    const res = await fetch(`${RESOLVER.url}?name=${domain}&do=true`, {
      headers: {
        Accept: "application/dns-json",
      },
    });

    if (!res.ok) throw source_error("No DNS response");

    const json: unknown = await res.json();
    const dnsResponse = validate_dns_response(json);

    // https://datatracker.ietf.org/doc/rfc3655/
    const validity = dnsResponse.AD;

    data.valid = {
      value: validity,
      sources: [
        {
          organization: RESOLVER.name,
          links: RESOLVER.links,
          country: RESOLVER.country,
        },
      ],
    };
  } catch (e) {
    const error = e as Error;
    console.error(`${error.message} from ${RESOLVER.name}`);
  }

  return data;
}
