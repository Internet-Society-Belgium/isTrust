import { JSX, type Component } from "solid-js";
import "../styles.css";

interface Props {
  title: string;
  children: JSX.Element;
}

export const Section: Component<Props> = (props) => {
  return (
    <div class="bg-container ring-border divide-border divide-y rounded-lg ring-1">
      <div class="flex w-full items-center justify-between px-4 py-2">
        <h2>{props.title}</h2>
      </div>

      <div class="flex flex-col gap-1 p-4">{props.children}</div>
    </div>
  );
};
