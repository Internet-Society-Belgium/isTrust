import { Show, Suspense, type Component } from "solid-js";
import "../styles.css";
import { Overflow } from "../overflow";

export const Logo: Component = () => {
  return (
    <div class="my-4 flex items-center justify-center">
      <div class="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 135.467 135.467"
        >
          <path
            fill="none"
            stroke="#07f"
            stroke-width="21.167"
            d="M24.647 29.997c16.995-18.288 66.205-18.288 86.204 0 7.502 54.08-21.446 71.45-43.102 87.685-21.765-16.236-50.713-33.604-43.102-87.685Z"
          />
        </svg>
        <h1>isTrust</h1>
      </div>
    </div>
  );
};

interface Props {
  value: string | null | undefined;
}

export const Domain: Component<Props> = (props) => {
  return (
    <Suspense fallback={<span>Analyzing...</span>}>
      <Show
        when={props.value}
        fallback={<p class="text-muted">Effective domain</p>}
      >
        {(value) => (
          <Overflow>
            <h1 class="text-xl">{value()}</h1>
          </Overflow>
        )}
      </Show>
    </Suspense>
  );
};
