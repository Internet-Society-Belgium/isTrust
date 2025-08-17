import { Match, Switch } from "solid-js";
import { Flag } from "./flag";

export function Country(props: {
  type: "text" | "icon";
  value: string;
  lang: string;
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
