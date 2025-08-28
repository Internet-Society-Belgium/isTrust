import { user_error } from "../error";

export function parse_tld(text: string) {
  let tld;
  try {
    const url = new URL(`https://${text}`);
    tld = url.hostname;
  } catch {
    throw user_error("Invalid TLD");
  }

  return tld;
}

export function parse_domain(text: string) {
  text = text.trim();

  const domainWithoutProtocol = text.match(/^(\w+:\/\/)?(.*)/)?.at(2);

  if (domainWithoutProtocol === undefined) {
    throw user_error("Invalid URL or domain name");
  }

  let domain;
  try {
    const url = new URL(`https://${domainWithoutProtocol}`);
    domain = url.hostname;
  } catch {
    throw user_error("Invalid URL or domain name");
  }

  // remove the optional trailing dot
  if (domain.endsWith(".")) {
    domain = domain.slice(0, -1);
  }

  if (domain.split(".").length < 2) {
    throw user_error("Invalid domain name");
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URL/hostname
  // exclude IP addresses
  if (/^[0-9\\.]+$/.test(domain)) {
    throw user_error("IP addresses are not supported");
  }

  domain = domain.trim();

  if (domain === "") throw user_error("Empty URL or domain name");

  return domain;
}
