export function parse_domain(text: string) {
  const domainWithoutProtocol = text.match(/^(\w+:\/\/)?(.*)/)?.at(2);

  const url = new URL(`https://${domainWithoutProtocol}`);
  let domain = url.hostname;

  // remove the optional trailing dot
  if (domain[domain.length - 1] === ".") {
    domain = domain.substring(0, domain.length - 1);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname
  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw new Error("IP addresses are not supported");
  }

  return domain;
}
