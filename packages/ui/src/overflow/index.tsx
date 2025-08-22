import { createSignal, JSX, onMount } from "solid-js";

export function Overflow(props: { direction?: "rtl"; children: JSX.Element }) {
  const [overflowBegin, setOverflowBegin] = createSignal<boolean>(false);
  const [overflowEnd, setOverflowEnd] = createSignal<boolean>(false);

  let element!: HTMLDivElement;

  onMount(() => {
    computeOverflow();
  });

  const computeOverflow = () => {
    if (element.scrollWidth > element.clientWidth) {
      if (props.direction === "rtl") {
        element.scrollBy(element.scrollWidth, 0);
      }

      const percent = Math.round(
        (element.scrollLeft / (element.scrollWidth - element.clientWidth)) *
          100,
      );

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
      <div
        class={
          (overflowBegin()
            ? "from-container bg-gradient-to-r to-transparent"
            : "") +
          " " +
          "pointer-events-none absolute inset-y-0 left-0 h-full w-4 transition-colors"
        }
      />

      <p
        ref={element}
        class="overflow-x-hidden overflow-y-hidden text-nowrap hover:overflow-x-auto [&::-webkit-scrollbar]:hidden"
        onScroll={() => {
          computeOverflow();
        }}
      >
        {props.children}
      </p>

      <div
        class={
          (overflowEnd()
            ? "from-container bg-gradient-to-l to-transparent"
            : "") +
          " " +
          "pointer-events-none absolute inset-y-0 right-0 h-full w-4 transition-colors"
        }
      />
    </div>
  );
}
