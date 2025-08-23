import {
  improve_informations,
  improve_links,
  InformationCache,
  Source,
} from "../../type";
import { parse_tld } from "../../utils/domain";
import {
  feature_missing_error,
  source_error,
  user_error,
} from "../../utils/error";
import { WHOISData } from "../type";
import {
  JCard,
  RdapResult,
  stringify_rdap_value,
  validate_bootstrap,
  validate_rdap_result,
} from "./type";

const CACHING_DAYS = 7;

export async function update(cache: InformationCache) {
  let loading = await cache.psl.get("_loading");

  while (loading === "true") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    loading = await cache.psl.get("_loading");
  }

  const lastUpdate = await cache.rdap.get("_lastUpdate");

  const cachingOutdated = new Date().setDate(
    new Date().getDate() - CACHING_DAYS,
  );

  if (
    lastUpdate === undefined ||
    new Date(lastUpdate).getTime() < cachingOutdated
  ) {
    await load(cache);
  }
}

export async function load(cache: InformationCache) {
  await cache.psl.set("_loading", "true");

  try {
    await cache.rdap.clear();

    // https://www.iana.org/assignments/rdap-dns/rdap-dns.xhtml
    const res = await fetch("https://data.iana.org/rdap/dns.json");

    if (!res.ok) throw source_error("RDAP bootstrap not available");

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

          promises.push(
            cache.rdap.set(tld, [...cachedApis, ...apis].join(",")),
          );
        } catch (e) {
          console.error(e);
        }
      }
    }

    await Promise.allSettled(promises);

    await cache.rdap.set("_lastUpdate", new Date().toISOString());
  } catch (e) {
    console.error(e);
  }

  await cache.psl.set("_loading", "false");
}

export async function get_data(domain: string, cache: InformationCache) {
  await update(cache);

  const tld = domain.split(".").at(-1);
  if (tld === undefined) throw user_error("No TLD");

  const bootstrap = await cache.rdap.get(tld);
  if (bootstrap === undefined)
    throw feature_missing_error(`No source available for .${tld}`);

  const data: WHOISData = {
    registrations: [],
    individuals: [],
    organizations: [],
    countries: [],
  };

  const apis = bootstrap.split(",");

  const apiQueue: string[] = [...apis];
  const apiHistory: string[] = [];
  while (apiQueue.length !== 0) {
    let api = apiQueue.shift();
    if (api === undefined) continue;

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
          Accept: "application/rdap+json",
        },
      });

      if (!res.ok) throw source_error("No RDAP response");

      const json: unknown = await res.json();

      const rdapResult = validate_rdap_result(json);

      improve_data(data, rdapResult);

      if (rdapResult.links !== undefined) {
        for (const link of rdapResult.links) {
          if (link.rel === "related" && link.type === "application/rdap+json") {
            apiQueue.push(link.href);
          }
        }
      }
    } catch (e) {
      const error = e as Error;
      console.error(`${error.message} from ${new URL(api).hostname}`);

      continue;
    }
  }

  return data;
}

function improve_data(data: WHOISData, result: RdapResult) {
  let organization: string | undefined;

  const registrarEntity = result.entities.find((e) => {
    return e.roles.findIndex((r) => r === "registrar") !== -1;
  });

  if (
    registrarEntity !== undefined &&
    registrarEntity.vcardArray !== undefined
  ) {
    organization = get_organization(registrarEntity.vcardArray);

    if (organization === undefined) {
      const name = get_name(registrarEntity.vcardArray);

      if (name !== undefined) {
        organization = name;
      }
    }
  }

  const sources: Source[] = [];

  if (organization !== undefined) {
    const source: Source = {
      organization,
      links: [],
    };

    if (
      registrarEntity !== undefined &&
      registrarEntity.vcardArray !== undefined
    ) {
      const country = get_country(registrarEntity.vcardArray);

      if (country !== undefined) {
        source.country = country;
      }

      let hrefs = registrarEntity.links?.map((link) => link.href);

      hrefs = hrefs?.filter((link) => !/(\/rdap)|(rdap\.)/i.test(link));

      if (hrefs !== undefined) {
        let links: string[] = [];
        for (const href of hrefs) {
          links = improve_links(links, href);
        }

        if (links.length > 0) {
          source.links = links;
        }
      }
    }

    sources.push(source);
  }

  for (const event of result.events) {
    if (event.eventAction === "registration") {
      const registrationDate = new Date(event.eventDate).setUTCHours(
        0,
        0,
        0,
        0,
      );

      const improvedRegistrations = improve_informations(data.registrations, {
        value: new Date(registrationDate).toISOString(),
        sources,
        verified: true,
      });
      if (improvedRegistrations.length > 0) {
        data.registrations = improvedRegistrations;
      }
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
        const improvedIndividuals = improve_informations(data.individuals, {
          value: fn,
          verified: false,
          sources,
        });
        if (improvedIndividuals.length > 0) {
          data.individuals = improvedIndividuals;
        }
      }
    }

    const organization = get_organization(registrantEntity.vcardArray);

    if (organization !== undefined) {
      const improvedOrganizations = improve_informations(data.organizations, {
        value: organization,
        verified: false,
        sources,
      });
      if (improvedOrganizations.length > 0) {
        data.organizations = improvedOrganizations;
      }
    }

    const country = get_country(registrantEntity.vcardArray);

    if (country !== undefined) {
      const improvedCountries = improve_informations(data.countries, {
        value: country,
        verified: false,
        sources,
      });
      if (improvedCountries.length > 0) {
        data.countries = improvedCountries;
      }
    }
  }

  return data;
}

function get_name(jCard: JCard) {
  const fnProperty = jCard[1].find((p) => p[0] === "fn");

  if (fnProperty === undefined) return;

  const fnValue = fnProperty[3];

  return stringify_rdap_value(fnValue);
}

function get_organization(jCard: JCard) {
  const orgProperty = jCard[1].find((p) => p[0] === "org");

  if (orgProperty === undefined) return;

  const orgValue = orgProperty[3];

  return stringify_rdap_value(orgValue);
}

function get_country(vcardArray: JCard) {
  const adrProperty = vcardArray[1].find((p) => p[0] === "adr");

  if (adrProperty === undefined) return;

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

  return;
}
