import { Show, Suspense } from "solid-js";
import { Overflow } from "../overflow";

export function HeaderDomain(props: { value?: string }) {
  return (
    <div class="mb-2 flex items-center justify-center text-xl">
      <Suspense fallback={<p class="text-muted">Analyzing...</p>}>
        <Show
          when={props.value}
          fallback={<p class="text-muted">Domain name</p>}
        >
          {(value) => (
            <Overflow>
              <h1>{value()}</h1>
            </Overflow>
          )}
        </Show>
      </Suspense>
    </div>
  );
}
