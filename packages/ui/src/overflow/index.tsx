import { createSignal, JSX, onMount, Show } from "solid-js";

export function Overflow(props: { children: JSX.Element }) {
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
      <p
        ref={element}
        class="overflow-x-auto overflow-y-hidden text-nowrap"
        onScroll={() => {
          computeOverflow();
        }}
      >
        {props.children}
      </p>
      <Show when={overflowEnd()}>
        <div class="from-container absolute inset-y-0 right-0 h-full w-4 bg-gradient-to-l to-transparent" />
      </Show>
    </div>
  );
}
