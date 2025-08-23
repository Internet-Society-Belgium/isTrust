import { Buffer as BufferPolyfill } from "buffer";
import dnsPacket from "dns-packet";
import { source_error } from "../utils/error";
import { DNSSECData } from "./type";

// declare var Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

interface Resolver {
  url: string;
  name: string;
  country?: string;
  links: string[];
}

export async function get_data(domain: string) {
  const resolvers: Resolver[] = [
    {
      // https://docs.quad9.net/services/
      url: "https://dns12.quad9.net/dns-query",
      name: "Quad9",
      country: "CH",
      links: ["https://quad9.net/"],
    },
    {
      // https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-wireformat/
      url: "https://cloudflare-dns.com/dns-query",
      name: "Cloudflare",
      country: "US",
      links: ["https://one.one.one.one/dns/"],
    },
  ];

  const data: DNSSECData = {};

  // https://www.rfc-editor.org/rfc/rfc1035.html
  const queryBuffer = dnsPacket.encode({
    type: "query",
    flags:
      dnsPacket.RECURSION_DESIRED |
      dnsPacket.AUTHENTIC_DATA |
      dnsPacket.DNSSEC_OK,
    questions: [
      {
        type: "A",
        name: domain,
      },
    ],
  });

  const dnsQueryParam = queryBuffer.toString("base64").replace(/=/g, "");

  while (resolvers.length > 0) {
    const resolver = resolvers.shift();
    if (resolver === undefined) continue;

    try {
      const res = await fetch(`${resolver.url}?dns=${dnsQueryParam}`, {
        headers: {
          Accept: "application/dns-message",
        },
      });

      if (!res.ok) throw source_error("No DNS response");

      const resBuffer = await res.arrayBuffer();
      const decoded = dnsPacket.decode(Buffer.from(resBuffer));

      // https://datatracker.ietf.org/doc/rfc3655/
      const validity = decoded.flag_ad;

      data.valid = {
        value: validity,
        sources: [
          {
            organization: resolver.name,
            links: resolver.links,
            country: resolver.country,
          },
        ],
        verified: true,
      };

      return data;
    } catch {
      continue;
    }
  }

  return data;
}
