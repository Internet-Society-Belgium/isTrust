import * as dnsPacket from "@leichtgewicht/dns-packet";
import { source_error } from "../utils/error";
import { DNSSECData } from "./type";

interface Resolver {
  url: string;
  name: string;
  country?: string;
  links: string[];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uint8ToBase64(buffer: Uint8Array) {
  let binary = "";
  for (const byte of buffer) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
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
    id: getRandomInt(1, 65534),
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

  const dnsQueryParam = uint8ToBase64(queryBuffer);

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

      const resBytes = await res.bytes();
      const decoded = dnsPacket.decode(resBytes);

      // https://datatracker.ietf.org/doc/rfc3655/
      const validity = decoded.flag_ad;
      if (validity === undefined) continue;

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
