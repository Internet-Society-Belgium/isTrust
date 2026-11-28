import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { ErrorBoundary, JSX, Show, Suspense } from "solid-js";
import { Issue } from "../issue";
import { List } from "../list";

export function Section(props: {
  title: string;
  children: JSX.Element;
  suffix?: JSX.Element;
}) {
  return (
    <>
      <div class="align-center flex w-full items-center text-center">
        <div class="border-border w-full border-t border-solid" />
        <div class="mx-3 flex font-medium whitespace-nowrap">
          <span class="text-sm">{props.title}</span>
        </div>
        <div class="border-border w-full border-t border-solid" />
      </div>

      <div class="relative">
        {props.children}

        {props.suffix}
      </div>
    </>
  );
}

// `testid` and the `data-state` markers (loading, error, unavailable, empty,
// ready, and not-available on SectionItemNotAvailable) are hooks for the E2E
// tests in tests/e2e-chrome: they don't depend on the language, unlike the text.
export function SectionItem<T>(props: {
  testid?: string;
  base?: string;
  lang: string;
  title: string;
  description: JSX.Element;
  informations?: common.Information<T> | common.Information<T>[];
  prefix: JSX.Element;
  // eslint-disable-next-line no-unused-vars
  children: (item: common.Information<T>, index: number) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
  suffix?: (item: common.Information<T>) => JSX.Element;
}) {
  const toArray = (data: common.Information<T> | common.Information<T>[]) => {
    if (Array.isArray(data)) {
      return data;
    }

    return [data];
  };

  return (
    <div data-testid={props.testid} class="relative flex items-center gap-2">
      <div title={props.title}>{props.prefix}</div>
      <ErrorBoundary
        fallback={(error: Error) => (
          <div data-state="error">
            <p class="text-muted">{props.description}</p>
            <Issue base={props.base} lang={props.lang} error={error} />
          </div>
        )}
      >
        <Suspense
          fallback={
            <div data-state="loading" class="flex items-center gap-0.5">
              <p class="text-muted">{props.description}</p>
              <div class="p-1">
                <div class="border-muted/75 size-4 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          }
        >
          <Show
            when={props.informations}
            fallback={
              <p data-state="unavailable" class="text-muted">
                {props.description}
              </p>
            }
          >
            {(informations) => (
              <Show when={toArray(informations())}>
                {(information) => (
                  <Show
                    when={information().length > 0}
                    fallback={
                      <p data-state="empty" class="text-muted">
                        {i18n("No information available", props.lang)}
                      </p>
                    }
                  >
                    <div data-state="ready" class="contents">
                      <List each={information()} suffix={props.suffix}>
                        {(item, index) => <>{props.children(item, index)}</>}
                      </List>
                    </div>
                  </Show>
                )}
              </Show>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export function SectionItemNotAvailable(props: {
  testid?: string;
  title: string;
  prefix: JSX.Element;
}) {
  return (
    <div
      data-testid={props.testid}
      data-state="not-available"
      class="relative flex items-center gap-2"
    >
      <div title={props.title}>{props.prefix}</div>

      <p class="text-muted">{props.title}</p>
    </div>
  );
}
