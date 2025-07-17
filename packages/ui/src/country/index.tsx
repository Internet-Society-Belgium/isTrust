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
    <p class="inline-flex items-baseline gap-1">
      {getRegionName(props.value, props.locale)}
      <Flag code={props.value} />
    </p>
  );
};
