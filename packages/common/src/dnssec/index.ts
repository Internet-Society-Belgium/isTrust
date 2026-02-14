import * as dnsPacket from "@dnsquery/dns-packet";
import { DNSSECData } from "./type";

const DOH_RESOLVERS = [
  // NGO

  {
    name: "Foundation for Applied Privacy",
    country: "AT",
    links: ["https://applied-privacy.net/services/dns/"],
    endpoint: "https://doh.applied-privacy.net/query",
    cors: true,
  },
  {
    name: "Digitale Gesellschaft",
    country: "CH",
    links: ["https://www.digitale-gesellschaft.ch/dns/"],
    endpoint: "https://dns.digitale-gesellschaft.ch/dns-query",
    cors: true,
  },
  {
    name: "La Contre-Voie",
    country: "FR",
    links: ["https://lacontrevoie.fr/"],
    endpoint: "https://doh.lacontrevoie.fr/dns-query",
    cors: true,
  },

  // Public

  {
    name: "DNS4EU",
    country: "CZ",
    links: ["https://joindns4.eu/for-public"],
    endpoint: "https://unfiltered.joindns4.eu/dns-query",
    cors: true,
  },
  {
    name: "Wikimedia",
    country: "US",
    links: ["https://meta.wikimedia.org/wiki/Wikimedia_DNS"],
    endpoint: "https://wikimedia-dns.org/dns-query",
    cors: true,
  },

  // DNS Registry

  {
    name: "SWITCH",
    country: "CH",
    links: ["https://www.switch.ch/"],
    endpoint: "https://dns.switch.ch/dns-query",
    cors: true,
  },
  {
    name: "Canadian Internet Registration Authority",
    country: "CA",
    links: ["https://www.cira.ca/en/canadian-shield/"],
    endpoint: "https://private.canadianshield.cira.ca/dns-query",
    cors: true,
  },
  {
    name: "CZ.NIC",
    country: "CZ",
    links: ["https://www.nic.cz/odvr/"],
    endpoint: "https://odvr.nic.cz/dns-query",
    cors: true,
  },

  // Privacy friendly

  {
    name: "Cloudflare",
    country: "US",
    links: ["https://one.one.one.one/dns/"],
    endpoint: "https://cloudflare-dns.com/dns-query",
    cors: false,
  },
  // {
  //   name: "DNS.SB",
  //   country: "DE",
  //   links: ["https://dns.sb/"],
  //   endpoint: "https://dns.sb/dns-query",
  //   cors: false,
  // },
  {
    name: "Mullvad",
    country: "SE",
    links: ["https://mullvad.net/"],
    endpoint: "https://dns.mullvad.net/dns-query",
    cors: true,
  },
  {
    name: "Control D",
    country: "CA",
    links: ["https://controld.com/free-dns"],
    endpoint: "https://freedns.controld.com/p0",
    cors: true,
  },
  // {
  //   name: "AdGuard DNS",
  //   country: "CY",
  //   links: ["https://adguard-dns.io/"],
  //   endpoint: "https://unfiltered.adguard-dns.com/dns-query",
  //   cors: true,
  // },
  // {
  //   name: "Rethink DNS",
  //   country: "IN",
  //   links: ["https://www.rethinkdns.com/"],
  //   endpoint: "https://sky.rethinkdns.com/",
  //   cors: true,
  // },

  // Commercial

  // {
  //   name: "Google",
  //   country: "US",
  //   links: ["https://dns.google/"],
  //   endpoint: "https://dns.google/dns-query",
  //   cors: true,
  // },
  // {
  //   name: "OpenDNS",
  //   country: "US",
  //   links: ["https://www.opendns.com/home-internet-security/"],
  //   endpoint: "https://doh.opendns.com/dns-query",
  //   cors: true,
  // },
];

export async function get_data(domain: string, canBypassCORS: boolean) {
  const data: DNSSECData = {};

  const resolvers = DOH_RESOLVERS.filter(({ cors }) =>
    canBypassCORS === true ? true : cors === false,
  )
    .map((value) => ({
      value,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (const resolver of resolvers) {
    try {
      // https://learn.microsoft.com/en-us/windows-server/networking/dns/validate-dnssec-responses
      const queryPacket = dnsPacket.encode({
        type: "query",
        id: Math.floor(Math.random() * 65534),
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [{ type: "A", name: domain }],
        additionals: [
          {
            type: "OPT",
            name: ".",
            // @ts-ignore https://github.com/dnsquery/dns-packet/issues/1
            flags: dnsPacket.DNSSEC_OK,
          },
        ],
      });

      const res = await fetch(resolver.endpoint, {
        method: "POST",
        headers: { "content-type": "application/dns-message" },
        // @ts-ignore
        body: queryPacket,
      });

      const responseBytes = new Uint8Array(await res.arrayBuffer());
      const responseData = dnsPacket.decode(responseBytes);

      // https://datatracker.ietf.org/doc/rfc3655/
      const validity = responseData.flag_ad || false;

      data.valid = {
        value: validity,
        sources: [
          {
            organization: resolver.name,
            links: resolver.links,
            country: resolver.country,
          },
        ],
      };

      return data;
    } catch (e) {
      const error = e as Error;
      console.error(`${error.message} from ${resolver.name}`);
    }
  }
}
