export function parse_domain(text: string) {
  const domainWithoutProtocol = text.match(/^(\w+:\/\/)?(.*)/)?.at(2);

  let domain;
  try {
    const url = new URL(`https://${domainWithoutProtocol}`);
    domain = url.hostname;
  } catch {
    throw new Error("Invalid URL or domain name");
  }

  // remove the optional trailing dot
  if (domain.endsWith(".")) {
    domain = domain.substring(0, domain.length - 1);
  }

  if (!domain.includes(".")) {
    throw new Error("Invalid domain name");
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname
  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw new Error("IP addresses are not supported");
  }

  domain = domain.trim();

  if (domain === "") return;

  return domain;
}
