import { createSignal, JSX, onMount, Show, type Component } from "solid-js";
import "../styles.css";

interface Props {
  children: JSX.Element;
}

export const Overflow: Component<Props> = (props) => {
  const [overflowBegin, setOverflowBegin] = createSignal<boolean>(false);
  const [overflowEnd, setOverflowEnd] = createSignal<boolean>(false);

  let element!: HTMLDivElement;

  onMount(() => {
    computeOverflow();
  });

  const computeOverflow = () => {
    if (element.scrollWidth > element.clientWidth) {
      const percent =
        (element.scrollLeft / (element.scrollWidth - element.clientWidth)) *
        100;

      if (percent <= 0) {
        setOverflowBegin(false);
      } else {
        setOverflowBegin(true);
      }

      if (percent >= 100) {
        setOverflowEnd(false);
      } else {
        setOverflowEnd(true);
      }
    }
  };

  return (
    <div class="relative min-w-0">
      <Show when={overflowBegin()}>
        <div class="from-container absolute inset-y-0 left-0 h-full w-4 bg-gradient-to-r to-transparent" />
      </Show>
      <div
        ref={element}
        class="overflow-x-auto overflow-y-hidden text-nowrap"
        onScroll={() => computeOverflow()}
      >
        {props.children}
      </div>
      <Show when={overflowEnd()}>
        <div class="from-container absolute inset-y-0 right-0 h-full w-4 bg-gradient-to-l to-transparent" />
      </Show>
    </div>
  );
};
