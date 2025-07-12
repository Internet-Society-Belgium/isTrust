// adapted from https://github.com/validatorjs/validator.js/blob/master/src/lib/isFQDN.js
export function parse_domain(domain: string) {
  const url = new URL(`https://${domain}`);
  domain = url.hostname;

  // remove the optional trailing dot
  if (domain[domain.length - 1] === ".") {
    domain = domain.substring(0, domain.length - 1);
  }

  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw new Error("Invalid domain");
  }

  return domain;
}
