export function parse_tld(text: string) {
  let tld;
  try {
    const url = new URL(`https://${text}`);
    tld = url.hostname;
  } catch {
    throw new Error(`Invalid TLD (${text})`);
  }

  return tld;
}

export function parse_domain(text: string) {
  const domainWithoutProtocol = text.match(/^(\w+:\/\/)?(.*)/)?.at(2);

  if (domainWithoutProtocol === undefined)
    throw new Error(`Invalid URL or domain name (${text})`);

  let domain;
  try {
    const url = new URL(`https://${domainWithoutProtocol}`);
    domain = url.hostname;
  } catch {
    throw new Error(`Invalid URL or domain name (${text})`);
  }

  // remove the optional trailing dot
  if (domain.endsWith(".")) {
    domain = domain.slice(0, -1);
  }

  if (domain.split(".").length < 2) {
    throw new Error(`Invalid domain name (${domain})`);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname
  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw new Error(`IP addresses are not supported (${domain})`);
  }

  domain = domain.trim();

  if (domain === "") return;

  return domain;
}
