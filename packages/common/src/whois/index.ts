import { DataCache } from "../type";
import { improve_array } from "../utils/array";
import { parse_tld } from "../utils/domain";
import {
  RdapResult,
  stringifyRdapValue,
  validateBootstrap,
  validateRdapResult,
  WHOISData,
} from "./type";

const CACHING_DAYS = 7;

export async function update(cache: DataCache) {
  const lastUpdate = await cache.rdap.get("_lastUpdate");

  const cachingOutdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (lastUpdate === null || new Date(lastUpdate).getTime() < cachingOutdated) {
    await load(cache);
  }
}

export async function load(cache: DataCache) {
  await cache.rdap.clear();

  // https://www.iana.org/assignments/rdap-dns/rdap-dns.xhtml
  const res = await fetch("https://data.iana.org/rdap/dns.json", {
    cache: "no-cache",
  });

  const json: unknown = await res.json();

  const bootstrap = validateBootstrap(json);

  const promises: Promise<void>[] = [];

  for (const service of bootstrap.services) {
    const tlds = service[0];
    const apis = service[1];

    for (let tld of tlds) {
      tld = parse_tld(tld);
      if (tld === undefined) continue;

      const cachedData = await cache.rdap.get(tld);
      const cachedApis = cachedData?.split(",") || [];

      promises.push(cache.rdap.set(tld, [...cachedApis, ...apis].join(",")));
    }
  }

  await Promise.allSettled(promises);

  await cache.rdap.set("_lastUpdate", new Date().toISOString());
}

export async function get_data(domain: string, cache: DataCache) {
  await update(cache);

  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw new Error("No TLD");

  const bootstrap = await cache.rdap.get(tld);
  if (bootstrap === null) throw new Error(`No RDAP available for .${tld}`);

  const data: WHOISData = {};

  const apis = bootstrap.split(",");

  const apiQueue: string[] = [...apis];
  const apiHistory: string[] = [];
  while (apiQueue.length !== 0) {
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

      const json: unknown = await res.json();

      const rdapResult = validateRdapResult(json);

      improveData(data, rdapResult);

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

function improveData(data: WHOISData, result: RdapResult) {
  for (const event of result.events) {
    if (event.eventAction === "registration") {
      if (data.registration === undefined) {
        data.registration = new Date(event.eventDate).toISOString();
      }
    } else if (event.eventAction === "expiration") {
      if (data.expiration === undefined) {
        data.expiration = new Date(event.eventDate).toISOString();
      }
    }
  }

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

        const fn = stringifyRdapValue(fnValue);

        const improvedIndividual = improve_array(data.individual, fn);
        if (improvedIndividual) {
          data.individual = improvedIndividual;
        }
      }
    }

    const orgProperty = registrantEntity.vcardArray[1].find(
      (p) => p[0] === "org",
    );

    if (orgProperty !== undefined) {
      const orgValue = orgProperty[3];

      const organization = stringifyRdapValue(orgValue);

      const improvedOrganization = improve_array(
        data.organization,
        organization,
      );
      if (improvedOrganization) {
        data.organization = improvedOrganization;
      }
    }

    const adrProperty = registrantEntity.vcardArray[1].find(
      (p) => p[0] === "adr",
    );

    if (adrProperty !== undefined) {
      const adrParameter = adrProperty[1];

      const cc = adrParameter.cc;
      if (cc !== undefined) {
        const countryCode = stringifyRdapValue(cc);

        const improvedCountry = improve_array(data.country, countryCode);
        if (improvedCountry) {
          data.country = improvedCountry;
        }
      }

      if (data.country === undefined) {
        const addressValue = adrProperty[3];
        if (Array.isArray(addressValue)) {
          // https://www.rfc-editor.org/rfc/rfc6350#section-6.3.1
          const countryValue = addressValue[6];

          const countryName = stringifyRdapValue(countryValue);

          const improvedCountry = improve_array(data.country, countryName);
          if (improvedCountry) {
            data.country = improvedCountry;
          }
        }
      }
    }
  }

  if (result.secureDNS) {
    if (result.secureDNS.delegationSigned === true) {
      data.dnssecPresent = true;
    } else if (
      result.secureDNS.delegationSigned === false &&
      data.dnssecPresent !== true
    ) {
      data.dnssecPresent = false;
    }
  }

  return data;
}
