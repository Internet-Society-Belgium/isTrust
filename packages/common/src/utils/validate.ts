// adapted from https://github.com/validatorjs/validator.js/blob/master/src/lib/isFQDN.js
export function parse_domain(domain: string) {
  // Remove the optional trailing dot
  if (domain[domain.length - 1] === ".") {
    domain = domain.substring(0, domain.length - 1);
  }

  // punnycode version contain only ASCII characters https://datatracker.ietf.org/doc/rfc3492/
  if (!/^[A-Za-z0-9\\._-]+$/.test(domain)) {
    throw new Error("Invalid character");
  }

  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw new Error("Invalid domain");
  }

  return domain;
}
