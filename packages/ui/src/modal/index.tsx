import { JSX, type Component } from "solid-js";
import "../styles.css";

interface Props {
  children: JSX.Element;
}

export const Modal: Component<Props> = (props) => {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-gray-500/75 transition-opacity">
      {props.children}
    </div>
  );
};
