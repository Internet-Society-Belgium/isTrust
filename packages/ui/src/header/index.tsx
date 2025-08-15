import { ErrorBoundary, Show, Suspense } from "solid-js";
import { Issue } from "../issue";
import { Overflow } from "../overflow";

export function HeaderDomain(props: { value?: string }) {
  return (
    <div class="mb-2 flex items-center justify-center text-xl">
      <ErrorBoundary fallback={(error: Error) => <Issue error={error} />}>
        <Suspense fallback={<p class="text-muted">Configuring...</p>}>
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
      </ErrorBoundary>
    </div>
  );
}
