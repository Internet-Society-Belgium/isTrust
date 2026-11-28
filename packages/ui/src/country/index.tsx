import * as common from "@istrust/common";
import { Match, Switch } from "solid-js";
import { Flag } from "./flag";

// True when every whois owner name is a privacy or proxy service: the whois
// country is then the service's, not the owner's.
export async function is_proxy_owner(
  whois: {
    organizations: common.Information<string>[];
    individuals: common.Information<string>[];
  },
  cache: common.InformationCache,
) {
  const names = [...whois.organizations, ...whois.individuals].map(
    (information) => information.value,
  );
  if (names.length === 0) return false;

  const results = await Promise.all(
    names.map((name) => common.is_privacy_service(name, cache)),
  );
  return results.every((result) => result);
}

// Stable: verified first, then unverified, then the privacy service's.
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
