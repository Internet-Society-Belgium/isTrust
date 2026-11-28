import * as common from "@istrust/common";
import { createResource, Match, Resource, Switch } from "solid-js";
import { Flag } from "./flag";

type Whois = Awaited<ReturnType<typeof common.get_whois_data>>;

// Country of the proxy: whois gives it and the whois owner (organization, or
// name when there is none) is a proxy service.
export function create_is_proxy_country(
  whois: Resource<Whois | undefined>,
  cache: common.InformationCache,
) {
  const ready = () => (whois.state === "ready" ? whois() : undefined);

  const [proxyOwner] = createResource(ready, async (data) => {
    const owners =
      data.organizations.length > 0 ? data.organizations : data.individuals;
    const results = await Promise.all(
      owners.map((owner) => common.is_whois_proxy(owner.value, cache)),
    );
    return results.some((result) => result);
  });

  return (country: common.Information<string>) =>
    proxyOwner.state === "ready" &&
    proxyOwner() &&
    ready()?.countries.some((c) => c.value === country.value) === true;
}

// Stable: verified first, then unverified, then the proxy's.
export function sort_countries(
  countries: common.Information<string>[] | undefined,
  // eslint-disable-next-line no-unused-vars
  is_proxy: (country: common.Information<string>) => boolean,
) {
  if (countries === undefined) return;

  const rank = (country: common.Information<string>) => {
    if (is_proxy(country)) return 2;
    if (country.verified === true) return 0;
    return 1;
  };

  return [...countries].sort((a, b) => rank(a) - rank(b));
}

export function Country(props: {
  lang: string;
  type: "text" | "icon";
  value: string;
}) {
  const getRegionName = (code: string, lang: string) => {
    try {
      const regionNames = new Intl.DisplayNames(lang, { type: "region" });

      const name = regionNames.of(code);
      if (name === undefined) return code;

      return name;
    } catch {
      return code;
    }
  };

  return (
    <Switch>
      <Match when={props.type === "text"}>
        <span>{getRegionName(props.value, props.lang)}</span>
      </Match>
      <Match when={props.type === "icon"}>
        <div title={getRegionName(props.value, props.lang)}>
          <Flag code={props.value} />
        </div>
      </Match>
    </Switch>
  );
}
