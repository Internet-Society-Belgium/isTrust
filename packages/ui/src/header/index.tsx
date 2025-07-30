import { Show, Suspense, type Component } from "solid-js";
import "../styles.css";
import { Overflow } from "../overflow";

interface Props {
  value: string | null | undefined;
}

export const HeaderDomain: Component<Props> = (props) => {
  return (
    <div class="mb-2 flex items-center justify-center">
      <Suspense fallback={<span>Analyzing...</span>}>
        <Show
          when={props.value}
          fallback={<p class="text-muted">Domain name</p>}
        >
          {(value) => (
            <Overflow>
              <h1 class="text-xl">{value()}</h1>
            </Overflow>
          )}
        </Show>
      </Suspense>
    </div>
  );
};
