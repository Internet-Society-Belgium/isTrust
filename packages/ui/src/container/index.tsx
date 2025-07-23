import { JSX, type Component } from "solid-js";
import "../styles.css";

interface Props {
  title: string;
  children: JSX.Element;
}

export const Container: Component<Props> = (props) => {
  return (
    <div class="bg-container ring-border rounded-lg p-2 ring-1">
      <h2>{props.title}</h2>
      <div>{props.children}</div>
    </div>
  );
};
