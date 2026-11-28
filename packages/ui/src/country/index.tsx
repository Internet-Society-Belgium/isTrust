import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
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
  meta?: common.CountryRole[];
  proxy?: boolean;
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

  // Native tooltip: proxy warning, country name, then one line per role.
  const title = () =>
    [
      ...(props.proxy === true
        ? [i18n("Country of the proxy service, not of the owner", props.lang)]
        : []),
      getRegionName(props.value, props.lang),
      ...(props.meta ?? []).map((role) =>
        role === "office"
          ? i18n("Office", props.lang)
          : i18n("Place of incorporation", props.lang),
      ),
    ].join("\n");

  return (
    <Switch>
      <Match when={props.type === "text"}>
        <span title={title()}>{getRegionName(props.value, props.lang)}</span>
      </Match>
      <Match when={props.type === "icon"}>
        <div title={title()}>
          <Flag code={props.value} />
        </div>
      </Match>
    </Switch>
  );
}
