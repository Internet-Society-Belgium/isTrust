export const DOH_RESOLVERS: {
  name: string;
  country: string;
  links: string[];
  endpoint: string;
  protectedByCORS: boolean;
}[] = [
  // Public

  {
    name: "DNS4EU",
    country: "CZ",
    links: ["https://joindns4.eu/for-public"],
    endpoint: "https://unfiltered.joindns4.eu/dns-query",
    protectedByCORS: true,
  },
  {
    name: "Wikimedia",
    country: "US",
    links: ["https://meta.wikimedia.org/wiki/Wikimedia_DNS"],
    endpoint: "https://wikimedia-dns.org/dns-query",
    protectedByCORS: true,
  },

  // DNS Registry

  {
    name: "SWITCH",
    country: "CH",
    links: ["https://www.switch.ch/"],
    endpoint: "https://dns.switch.ch/dns-query",
    protectedByCORS: true,
  },
  {
    name: "DNS4all",
    country: "NL",
    links: ["https://dns4all.eu"],
    endpoint: "https://doh.dns4all.eu/dns-query",
    protectedByCORS: true,
  },
  // May keep logs
  // {
  //   name: "Canadian Internet Registration Authority",
  //   country: "CA",
  //   links: ["https://www.cira.ca/en/canadian-shield/"],
  //   endpoint: "https://private.canadianshield.cira.ca/dns-query",
  //   cors: true,
  // },
  {
    name: "CZ.NIC",
    country: "CZ",
    links: ["https://www.nic.cz/odvr/"],
    endpoint: "https://odvr.nic.cz/dns-query",
    protectedByCORS: true,
  },
  {
    name: "Restena",
    country: "LU",
    links: ["https://www.restena.lu/en/service/public-dns-resolver"],
    endpoint: "https://dnspub.restena.lu/dns-query",
    protectedByCORS: true,
  },

  // NGO

  {
    name: "dnscrypt.ca",
    country: "CA",
    links: ["https://dnscrypt.ca/"],
    endpoint: "https://dns1.dnscrypt.ca/dns-query",
    protectedByCORS: false,
  },
  {
    name: "Foundation for Applied Privacy",
    country: "AT",
    links: ["https://applied-privacy.net/services/dns/"],
    endpoint: "https://doh.applied-privacy.net/query",
    protectedByCORS: true,
  },
  {
    name: "Digitale Gesellschaft",
    country: "CH",
    links: ["https://www.digitale-gesellschaft.ch/dns/"],
    endpoint: "https://dns.digitale-gesellschaft.ch/dns-query",
    protectedByCORS: true,
  },

  // Privacy friendly

  {
    name: "Cloudflare",
    country: "US",
    links: ["https://one.one.one.one/dns/"],
    endpoint: "https://cloudflare-dns.com/dns-query",
    protectedByCORS: false,
  },
  {
    name: "DNS.SB",
    country: "DE",
    links: ["https://dns.sb/"],
    endpoint: "https://doh.sb/dns-query",
    protectedByCORS: false,
  },
  {
    name: "Mullvad",
    country: "SE",
    links: ["https://mullvad.net/"],
    endpoint: "https://dns.mullvad.net/dns-query",
    protectedByCORS: true,
  },
  {
    name: "Control D",
    country: "CA",
    links: ["https://controld.com/free-dns"],
    endpoint: "https://freedns.controld.com/p0",
    protectedByCORS: true,
  },
];
