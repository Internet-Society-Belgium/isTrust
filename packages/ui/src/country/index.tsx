import { Match, Switch, type Component } from "solid-js";
import { Flag } from "./flag";
import "../styles.css";

interface Props {
  type: "full" | "icon";
  value: string;
  locale: Intl.LocalesArgument;
}

export const Country: Component<Props> = (props) => {
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
    <div class="flex items-center gap-1">
      <Switch>
        <Match when={props.type === "full"}>
          <span>{getRegionName(props.value, props.locale)}</span>
          <Flag code={props.value} />
        </Match>
        <Match when={props.type === "icon"}>
          <div title={getRegionName(props.value, props.locale)}>
            <Flag code={props.value} />
          </div>
        </Match>
      </Switch>
    </div>
  );
};
