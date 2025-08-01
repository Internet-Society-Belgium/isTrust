import { JSX, Show, Suspense, type Component } from "solid-js";
import "../styles.css";
import * as common from "@istrust/common";
import { List } from "../list";

interface Props {
  title: string;
  children: JSX.Element;
}

export const Section: Component<Props> = (props) => {
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
};

export function SectionItem<T>(props: {
  description: string;
  data?: common.Data<T> | common.Data<T>[];
  prefix: JSX.Element;
  // eslint-disable-next-line no-unused-vars
  children: (item: common.Data<T>) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
  suffix?: (item: common.Data<T>) => JSX.Element;
}) {
  const toArray = (data: common.Data<T> | common.Data<T>[] | undefined) => {
    if (data === undefined) return [];

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
          when={props.data !== undefined}
          fallback={<p class="text-muted">{props.description}</p>}
        >
          <Show
            when={props.data}
            fallback={<p class="text-muted">No information available</p>}
          >
            <Show when={toArray(props.data)}>
              {(items) => (
                <List each={items()} suffix={props.suffix}>
                  {(item) => <>{props.children(item)}</>}
                </List>
              )}
            </Show>
          </Show>
        </Show>
      </Suspense>
    </div>
  );
}
