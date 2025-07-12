import { InternalCache } from "../type";
import { parse_domain } from "../utils/domain";
import { deepMerge } from "../utils/object";
import {
  RdapResult,
  validateBootstrap,
  validateRdapResult,
  WHOISData,
} from "./type";

const CACHING_DAYS = 7;

export async function update(cache: InternalCache) {
  const lastUpdate = await cache.rdap.get("_lastUpdate");

  const caching_outdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (
    lastUpdate === null ||
    new Date(lastUpdate).getTime() < caching_outdated
  ) {
    await load(cache);
  }
}

export async function load(cache: InternalCache) {
  await cache.rdap.flush();

  // https://www.iana.org/assignments/rdap-dns/rdap-dns.xhtml
  const res = await fetch("https://data.iana.org/rdap/dns.json", {
    cache: "no-cache",
  });

  const json = await res.json();

  const bootstrap = validateBootstrap(json);

  const promises: Promise<void>[] = [];

  for (const service of bootstrap.services) {
    const tlds = service[0];
    const apis = service[1];

    for (let tld of tlds) {
      tld = parse_domain(tld);

      const rdapTld = await cache.rdap.get(tld);

      if (rdapTld === null) {
        promises.push(cache.rdap.set(tld, JSON.stringify([...apis])));
      } else {
        const otherApis = JSON.parse(rdapTld);
        promises.push(
          cache.rdap.set(tld, JSON.stringify([...otherApis, ...apis])),
        );
      }
    }
  }

  await Promise.allSettled(promises);

  await cache.rdap.set("_lastUpdate", Date.now().toString());
}

export async function get_data(domain: string, cache: InternalCache) {
  await update(cache);

  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw new Error("No TLD");

  const bootstrap = await cache.rdap.get(tld);
  if (bootstrap === null) throw new Error(`No RDAP available for .${tld}`);

  const data: WHOISData = {
    domain,
  };

  const apis = JSON.parse(bootstrap);

  const apiQueue = [...apis];
  while (apiQueue.length !== 0 && isDataPartial(data)) {
    const api = apiQueue.shift();

    try {
      // https://www.rfc-editor.org/rfc/rfc9082.html#name-domain-path-segment-specifi
      const res = await fetch(`${api}domain/${domain}`, {
        cache: "no-cache",
      });

      const json = await res.json();

      const rdapResult = validateRdapResult(json);

      const parse_result = parse(rdapResult);
      deepMerge(data, parse_result);

      for (const link of rdapResult.links) {
        if (link.rel === "related" && link.type === "application/rdap+json") {
          apiQueue.push(link.href);
        }
      }
    } catch (error) {
      console.log(error);

      continue;
    }
  }

  return data;
}

function parse(result: RdapResult) {
  const data: WHOISData = { domain: result.ldhName.toLowerCase() };

  const events: typeof data.events = {};

  for (const event of result.events) {
    if (event.eventAction === "registration") {
      events.registration = new Date(event.eventDate);
    }
  }

  data.events = events;

  const registrant: typeof data.registrant = {};

  const registrant_entity = result.entities.find((e) => {
    return e.roles.findIndex((r) => r === "registrant") !== -1;
  });

  if (registrant_entity !== undefined && registrant_entity.vcardArray) {
    const orgProperty = registrant_entity.vcardArray[1].find(
      (p) => p[0] === "org",
    );
    const adrProperty = registrant_entity.vcardArray[1].find(
      (p) => p[0] === "adr",
    );

    if (orgProperty !== undefined) {
      const organisation = orgProperty[3];
      if (!Array.isArray(organisation)) {
        registrant.organisation = organisation;
      }
    }

    const address: typeof registrant.address = {};

    if (adrProperty !== undefined) {
      const address_property = adrProperty[3];
      if (Array.isArray(address_property)) {
        // https://www.rfc-editor.org/rfc/rfc6350#section-6.3.1
        const state = address_property[3].trim();
        const region = address_property[4].trim();
        const country = address_property[6].trim();

        if (state !== "") {
          address.state = state;
        }

        if (region !== "") {
          address.region = region;
        }

        if (country !== "") {
          address.country = country;
        }
      }
    }

    if (Object.keys(address).length > 0) {
      registrant.address = address;
    }
  }

  if (Object.keys(registrant).length > 0) {
    data.registrant = registrant;
  }

  if (result.secureDNS) {
    data.dnssec = result.secureDNS.delegationSigned;
  }

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDataPartial(data: any) {
  if (
    data.events === undefined ||
    data.events.registration === undefined ||
    data.events.lastChanged === undefined ||
    data.events.expiration === undefined ||
    data.registrant === undefined ||
    data.registrant.organisation === undefined ||
    data.registrant.address === undefined ||
    data.registrant.address.state === undefined ||
    data.registrant.address.region === undefined ||
    data.registrant.address.country === undefined ||
    data.dnssec === undefined
  ) {
    return true;
  }

  return false;
}
