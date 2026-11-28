import * as common from "@istrust/common";
import { createResource, Match, Resource, Switch } from "solid-js";
import { Flag } from "./flag";

// A country is the proxy's when whois gives it and the whois owner is a proxy
// service.
export function create_is_proxy_country(
  whois: Resource<common.WHOISData | undefined>,
  cache: common.InformationCache,
) {
  const ready = () => (whois.state === "ready" ? whois() : undefined);

  const [proxyOwner] = createResource(ready, async (data) => {
    return await common.is_whois_proxy_owner(data, cache);
  });

  const in_whois = (country: common.Information<string>) =>
    ready()?.countries.some((c) => c.value === country.value) === true;

  return (country: common.Information<string>) =>
    proxyOwner.state === "ready" && proxyOwner() && in_whois(country);
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
