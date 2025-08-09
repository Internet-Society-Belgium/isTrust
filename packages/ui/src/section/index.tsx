import * as common from "@istrust/common";
import { ErrorBoundary, JSX, Show, Suspense, type Component } from "solid-js";
import { Issue } from "../issue";
import { List } from "../list";

interface SectionProps {
  query: string;
  title: string;
  children: JSX.Element;
}

export const Section: Component<SectionProps> = (props) => {
  return (
    <>
      <div class="align-center flex w-full items-center text-center">
        <div class="border-border w-full border-t border-solid" />
        <div class="mx-3 flex font-medium whitespace-nowrap">
          <span class="text-sm">{props.title}</span>
        </div>
        <div class="border-border w-full border-t border-solid" />
      </div>
      <ErrorBoundary
        fallback={(error) => <Issue query={props.query} error={error} />}
      >
        {props.children}
      </ErrorBoundary>
    </>
  );
};

interface SectionUnavailableProps {
  title: string;
  children: JSX.Element;
  message: JSX.Element;
}

export const SectionUnavailable: Component<SectionUnavailableProps> = (
  props,
) => {
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

        <div class="bg-container/75 absolute top-0 z-1 h-full w-full">
          {props.message}
        </div>
      </div>
    </>
  );
};

export function SectionItem<T>(props: {
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
    <div class="flex items-center gap-2">
      <div title={props.description}>{props.prefix}</div>
      <Suspense fallback={<p class="text-muted">Loading...</p>}>
        <Show
          when={props.informations}
          fallback={<p class="text-muted">{props.description}</p>}
        >
          {(informations) => (
            <Show when={toArray(informations())}>
              {(information) => (
                <Show
                  when={information().length > 0}
                  fallback={<p class="text-muted">No information available</p>}
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
    </div>
  );
}

export function SectionItemUnavailable(props: {
  description: string;
  prefix: JSX.Element;
}) {
  return (
    <div class="flex items-center gap-2">
      <div title={props.description}>{props.prefix}</div>

      <p class="text-muted">{props.description}</p>
    </div>
  );
}
