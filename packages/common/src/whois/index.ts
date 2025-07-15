import { InternalCache } from "../type";
import { parse_tld } from "../utils/domain";
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
  await cache.rdap.clear();

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
      tld = parse_tld(tld);
      if (tld === undefined) continue;

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

  await cache.rdap.set("_lastUpdate", new Date().toISOString());
}

export async function get_data(domain: string, cache: InternalCache) {
  await update(cache);

  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw new Error("No TLD");

  const bootstrap = await cache.rdap.get(tld);
  if (bootstrap === null) throw new Error(`No RDAP available for .${tld}`);

  const data: WHOISData = {};

  const apis = JSON.parse(bootstrap);

  const apiQueue: string[] = [...apis];
  const apiHistory: string[] = [];
  while (apiQueue.length !== 0 && isDataPartial(data)) {
    let api = apiQueue.shift();
    if (!api) continue;

    try {
      // https://www.rfc-editor.org/rfc/rfc9082.html#name-domain-path-segment-specifi
      if (!/\/domain\/(.+)$/.test(api)) {
        if (!api.endsWith("/")) {
          api += "/";
        }
        api += `domain/${domain}`;
      }

      if (apiHistory.includes(api)) continue;
      apiHistory.push(api);

      const res = await fetch(api, {
        cache: "no-cache",
      });

      if (!res.ok)
        throw new Error(`No RDAP response from ${new URL(api).hostname}`);

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
      console.error(error);

      continue;
    }
  }

  if (Object.keys(data).length === 0) return;

  return data;
}

function parse(result: RdapResult) {
  const data: WHOISData = {};

  for (const event of result.events) {
    if (event.eventAction === "registration") {
      data.registration = new Date(event.eventDate).toISOString();
    }
  }

  const registrant: typeof data.registrant = {};

  const registrantEntity = result.entities.find((e) => {
    return e.roles.findIndex((r) => r === "registrant") !== -1;
  });

  if (registrantEntity !== undefined && registrantEntity.vcardArray) {
    // https://www.rfc-editor.org/rfc/rfc6350#section-6.1.4
    let isIndividual = false;

    const kindProperty = registrantEntity.vcardArray[1].find(
      (p) => p[0] === "kind",
    );

    if (kindProperty !== undefined) {
      const kindValue = kindProperty[3];

      if (kindValue === "individual") {
        isIndividual = true;
      }
    } else {
      isIndividual = true;
    }

    if (isIndividual) {
      // https://www.rfc-editor.org/rfc/rfc6350#section-6.2.1
      const fnProperty = registrantEntity.vcardArray[1].find(
        (p) => p[0] === "fn",
      );

      if (fnProperty !== undefined) {
        const fnValue = fnProperty[3];

        let fn = "";
        if (Array.isArray(fnValue)) {
          fn = fnValue.join(" ").trim();
        } else {
          fn = fnValue.trim();
        }

        if (fn !== "") {
          registrant.individual = fn;
        }
      }
    }

    const orgProperty = registrantEntity.vcardArray[1].find(
      (p) => p[0] === "org",
    );

    if (orgProperty !== undefined) {
      const orgValue = orgProperty[3];

      let organization = "";
      if (Array.isArray(orgValue)) {
        organization = orgValue.join(" ").trim();
      } else {
        organization = orgValue.trim();
      }

      if (organization !== "") {
        registrant.organization = organization;
      }
    }

    const adrProperty = registrantEntity.vcardArray[1].find(
      (p) => p[0] === "adr",
    );

    if (adrProperty !== undefined) {
      const adrParameter = adrProperty[1];

      const country: typeof registrant.country = {};

      const cc = adrParameter.cc;
      if (cc !== undefined) {
        let countryCode = "";
        if (Array.isArray(cc)) {
          countryCode = cc.at(0)?.trim() || "";
        } else {
          countryCode = cc.trim();
        }

        if (countryCode !== "") {
          country.code = countryCode;
        }
      }

      if (registrant.country === undefined) {
        const addressValue = adrProperty[3];
        if (Array.isArray(addressValue)) {
          // https://www.rfc-editor.org/rfc/rfc6350#section-6.3.1
          const countryValue = addressValue[6];

          let countryName = "";
          if (Array.isArray(countryValue)) {
            countryName = countryValue.at(0)?.trim() || "";
          } else {
            countryName = countryValue.trim();
          }

          if (countryName !== "") {
            country.name = countryName;
          }
        }
      }

      if (Object.keys(country).length > 0) {
        registrant.country = country;
      }
    }
  }

  if (Object.keys(registrant).length > 0) {
    data.registrant = registrant;
  }

  if (result.secureDNS) {
    data.dnssecPresent = result.secureDNS.delegationSigned;
  }

  return data;
}

function isDataPartial(data: WHOISData) {
  if (
    data.registration === undefined ||
    data.registrant === undefined ||
    data.registrant.organization === undefined ||
    data.registrant.country === undefined ||
    data.dnssecPresent === undefined
  ) {
    return true;
  }

  return false;
}
