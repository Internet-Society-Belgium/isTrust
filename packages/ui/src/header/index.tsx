import i18n from "@istrust/i18n";
import { ErrorBoundary, Show, Suspense } from "solid-js";
import { IconIsTrust } from "../icon";
import { Issue } from "../issue";
import { Overflow } from "../overflow";

export function HeaderLogo() {
  return (
    <div class="my-4 flex items-center justify-center">
      <div class="flex items-center gap-1">
        <IconIsTrust size="md" />
        <h1 class="text-xl font-bold tracking-tight">isTrust</h1>
      </div>
    </div>
  );
}

export function HeaderDomain(props: {
  base?: string;
  lang: string;
  value?: string;
}) {
  return (
    <div class="mb-2 flex items-center justify-center text-xl">
      <ErrorBoundary
        fallback={(error: Error) => (
          <Issue base={props.base} lang={props.lang} error={error} />
        )}
      >
        <Suspense
          fallback={
            <div class="flex items-center gap-0.5">
              <p class="text-muted">{i18n("Configuring", props.lang)}</p>
              <div class="p-1">
                <div class="border-muted size-4 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          }
        >
          <Show
            when={props.value}
            fallback={
              <p class="text-muted">{i18n("Domain name", props.lang)}</p>
            }
          >
            {(value) => (
              <Overflow direction="rtl">
                <h1>{value()}</h1>
              </Overflow>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
