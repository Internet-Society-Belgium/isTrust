import { type Component } from "solid-js";
import BE from "./BE";

interface Props {
  code: string;
}

export const Flag: Component<Props> = (props) => {
  const getFlag = (code: string) => {
    if (code === "BE") return <BE />;
  };

  return <span class="h-6 w-6">{getFlag(props.code)}</span>;
};
