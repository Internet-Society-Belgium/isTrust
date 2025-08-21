import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { ErrorBoundary, JSX, Show, Suspense } from "solid-js";
import {
  Issue,
  IssueFeatureNotAvailableIn,
  IssueFeatureOnlyAvailableIn,
} from "../issue";
import { List } from "../list";

export function Section(props: { title: string; children: JSX.Element }) {
  return (
    <>
      <div class="align-center flex w-full items-center text-center">
        <div class="border-border w-full border-t border-solid" />
        <div class="mx-3 flex font-medium whitespace-nowrap">
          <span class="text-sm">{props.title}</span>
        </div>
        <div class="border-border w-full border-t border-solid" />
      </div>

      {props.children}
    </>
  );
}

export function SectionItem<T>(props: {
  lang: string;
  description: string;
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
    <div class="relative flex items-center gap-2">
      <div title={props.description}>{props.prefix}</div>
      <ErrorBoundary
        fallback={(error: Error) => (
          <div>
            <p class="text-muted">{props.description}</p>
            <Issue lang={props.lang} error={error} />
          </div>
        )}
      >
        <Suspense
          fallback={
            <div class="flex items-center gap-0.5">
              <p class="text-muted">{props.description}</p>
              <div class="p-1">
                <div class="border-muted/75 size-4 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            </div>
          }
        >
          <Show
            when={props.informations}
            fallback={<p class="text-muted">{props.description}</p>}
          >
            {(informations) => (
              <Show when={toArray(informations())}>
                {(information) => (
                  <Show
                    when={information().length > 0}
                    fallback={
                      <p class="text-muted">
                        {i18n("No information available", props.lang)}
                      </p>
                    }
                  >
                    <List each={information()} suffix={props.suffix}>
                      {(item, index) => <>{props.children(item, index)}</>}
                    </List>
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

export function SectionItemOnlyAvailableIn(props: {
  lang: string;
  description: string;
  prefix: JSX.Element;
  platform: string;
}) {
  return (
    <div class="relative flex items-center gap-2">
      <div title={props.description}>{props.prefix}</div>

      <p class="text-muted">{props.description}</p>

      <IssueFeatureOnlyAvailableIn
        lang={props.lang}
        platform={props.platform}
      />
    </div>
  );
}

export function SectionItemNotAvailableIn(props: {
  lang: string;
  description: string;
  prefix: JSX.Element;
  platform: string;
}) {
  return (
    <div class="relative flex items-center gap-2">
      <div title={props.description}>{props.prefix}</div>

      <p class="text-muted">{props.description}</p>

      <IssueFeatureNotAvailableIn lang={props.lang} platform={props.platform} />
    </div>
  );
}
