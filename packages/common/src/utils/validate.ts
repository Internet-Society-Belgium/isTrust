// adapted from https://github.com/validatorjs/validator.js/blob/master/src/lib/isFQDN.js
export function parse_domain(domain: string) {
  // Remove the optional trailing dot
  if (domain[domain.length - 1] === ".") {
    domain = domain.substring(0, domain.length - 1);
  }

  const parts = domain.split(".");
  const tld = parts[parts.length - 1];

  if (parts.length < 2) {
    throw new Error("No TLD");
  }

  if (
    !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(
      tld,
    )
  ) {
    throw new Error("TLD contains invalid character");
  }

  if (/\s/.test(tld)) {
    throw new Error("TLD cannot contain spaces");
  }

  if (/^\d+$/.test(tld)) {
    throw new Error("TLD cannot be all numeric");
  }

  for (const part of parts) {
    if (part.length > 63) {
      throw new Error("Domain too long");
    }

    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      throw new Error("Invalid character");
    }

    if (/[\uff01-\uff5e]/.test(part)) {
      throw new Error("Invalid character");
    }

    if (/^-|-$/.test(part)) {
      throw new Error("Domain parts cannot start or end with hyphen");
    }
  }

  return domain;
}
