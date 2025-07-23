import { JSX, type Component } from "solid-js";
import "../styles.css";

interface Props {
  title: JSX.Element;
  children: JSX.Element;
}

export const Container: Component<Props> = (props) => {
  return (
    <div class="bg-container ring-border divide-border divide-y rounded-lg ring-1">
      <div class="flex w-full items-center justify-between px-4 py-2">
        <div>{props.title}</div>
      </div>

      <div class="px-4 py-2">{props.children}</div>
    </div>
  );
};
