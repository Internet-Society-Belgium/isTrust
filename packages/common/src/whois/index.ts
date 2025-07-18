import { DataCache, improve_data_array, VerificationAuthority } from "../type";
import { parse_tld } from "../utils/domain";
import {
  JCard,
  RdapResult,
  stringify_rdap_value,
  validate_bootstrap,
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
  const res = await fetch("https://data.iana.org/rdap/dns.json");

  const json: unknown = await res.json();

  const bootstrap = validate_bootstrap(json);

  const promises: Promise<void>[] = [];

  for (const service of bootstrap.services) {
    const tlds = service[0];
    const apis = service[1];

    for (let tld of tlds) {
      try {
        tld = parse_tld(tld);

        const cachedData = await cache.rdap.get(tld);
        const cachedApis = cachedData?.split(",") || [];

        promises.push(cache.rdap.set(tld, [...cachedApis, ...apis].join(",")));
      } catch (e) {
        console.error(e);
      }
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
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Accept: "application/rdap+json",
        },
      });

      if (!res.ok)
        throw new Error(`No RDAP response from ${new URL(api).hostname}`);

      const json: unknown = await res.json();

      const rdapResult = validateRdapResult(json);

      improve_data(data, rdapResult);

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

function improve_data(data: WHOISData, result: RdapResult) {
  const registrar: VerificationAuthority = {};

  const registrarEntity = result.entities.find((e) => {
    return e.roles.findIndex((r) => r === "registrar") !== -1;
  });

  if (
    registrarEntity !== undefined &&
    registrarEntity.vcardArray !== undefined
  ) {
    const organization = get_organization(registrarEntity.vcardArray);

    if (organization !== undefined) {
      registrar.organization = organization;
    } else {
      const name = get_name(registrarEntity.vcardArray);

      if (name !== undefined) {
        registrar.organization = name;
      }
    }

    const country = get_country(registrarEntity.vcardArray);

    if (country !== undefined) {
      registrar.country = country;
    }

    const links = registrarEntity.links?.map((link) => link.href);
    if (links !== undefined) {
      registrar.links = links;
    }
  }

  for (const event of result.events) {
    const dateString = new Date(event.eventDate).toDateString();

    if (event.eventAction === "registration") {
      const improvedRegistration = improve_data_array(data.registration, {
        value: new Date(dateString).toISOString(),
        verification: {
          status: "verified",
          by: registrar,
        },
      });
      if (improvedRegistration.length > 0) {
        data.registration = improvedRegistration;
      }
    } else if (event.eventAction === "expiration") {
      const improvedExpiration = improve_data_array(data.expiration, {
        value: new Date(dateString).toISOString(),
        verification: {
          status: "verified",
          by: registrar,
        },
      });
      if (improvedExpiration.length > 0) {
        data.expiration = improvedExpiration;
      }
    }
  }

  if (result.secureDNS?.delegationSigned !== undefined) {
    const improvedDnssecPresent = improve_data_array(data.dnssecPresent, {
      value: result.secureDNS.delegationSigned,
      verification: {
        status: "verified",
        by: registrar,
      },
    });
    if (improvedDnssecPresent.length > 0) {
      data.dnssecPresent = improvedDnssecPresent;
    }
  }

  const registrantEntity = result.entities.find((e) => {
    return e.roles.findIndex((r) => r === "registrant") !== -1;
  });

  if (
    registrantEntity !== undefined &&
    registrantEntity.vcardArray !== undefined
  ) {
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
      const fn = get_name(registrantEntity.vcardArray);

      if (fn !== undefined) {
        const improvedIndividual = improve_data_array(data.individuals, {
          value: fn,
          verification: {
            status: "unverified",
            by: registrar,
          },
        });
        if (improvedIndividual.length > 0) {
          data.individuals = improvedIndividual;
        }
      }
    }

    const organization = get_organization(registrantEntity.vcardArray);

    if (organization !== undefined) {
      const improvedOrganization = improve_data_array(data.organizations, {
        value: organization,
        verification: {
          status: "unverified",
          by: registrar,
        },
      });
      if (improvedOrganization.length > 0) {
        data.organizations = improvedOrganization;
      }
    }

    const country = get_country(registrantEntity.vcardArray);

    if (country !== undefined) {
      const improvedCountry = improve_data_array(data.countries, {
        value: country,
        verification: {
          status: "unverified",
          by: registrar,
        },
      });
      if (improvedCountry.length > 0) {
        data.countries = improvedCountry;
      }
    }
  }

  return data;
}

function get_name(jCard: JCard) {
  const fnProperty = jCard[1].find((p) => p[0] === "fn");

  if (fnProperty !== undefined) {
    const fnValue = fnProperty[3];

    return stringify_rdap_value(fnValue);
  }
}

function get_organization(jCard: JCard) {
  const orgProperty = jCard[1].find((p) => p[0] === "org");

  if (orgProperty !== undefined) {
    const orgValue = orgProperty[3];

    return stringify_rdap_value(orgValue);
  }
}

function get_country(vcardArray: JCard) {
  const adrProperty = vcardArray[1].find((p) => p[0] === "adr");

  if (adrProperty !== undefined) {
    const adrParameter = adrProperty[1];

    const cc = adrParameter.cc;
    if (cc !== undefined) {
      const countryCode = stringify_rdap_value(cc);

      return countryCode;
    }

    const addressValue = adrProperty[3];
    if (Array.isArray(addressValue)) {
      // https://www.rfc-editor.org/rfc/rfc6350#section-6.3.1
      const countryValue = addressValue[6];

      const countryName = stringify_rdap_value(countryValue);

      return countryName;
    }
  }
}
