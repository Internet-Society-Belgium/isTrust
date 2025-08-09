import { Match, Switch } from "solid-js";
import { Flag } from "./flag";

export function Country(props: {
  type: "text" | "icon";
  value: string;
  locale: Intl.LocalesArgument;
}) {
  const getRegionName = (code: string, locale: Intl.LocalesArgument) => {
    try {
      const regionNames = new Intl.DisplayNames(locale, { type: "region" });

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
        <span>{getRegionName(props.value, props.locale)}</span>
      </Match>
      <Match when={props.type === "icon"}>
        <div title={getRegionName(props.value, props.locale)}>
          <Flag code={props.value} />
        </div>
      </Match>
    </Switch>
  );
}
