import { type Component } from "solid-js";
import { Flag } from "./flag";
import "../styles.css";

interface Props {
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
      <span>{getRegionName(props.value, props.locale)}</span>
      <Flag code={props.value} />
    </div>
  );
};
