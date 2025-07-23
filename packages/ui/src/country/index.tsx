import { Show, type Component } from "solid-js";
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
      <Show when={props.type === "full"}>
        <span>{getRegionName(props.value, props.locale)}</span>
      </Show>
      <Flag code={props.value} />
    </div>
  );
};
