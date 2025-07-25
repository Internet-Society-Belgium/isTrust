import { JSX, type Component } from "solid-js";
import "../styles.css";

interface Props {
  title: string;
  prefix: JSX.Element;
  children: JSX.Element;
}

export const Item: Component<Props> = (props) => {
  return (
    <div class="flex items-center gap-2">
      <div title={props.title}>{props.prefix}</div>
      {props.children}
    </div>
  );
};
