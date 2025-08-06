import { Component, For, JSX, Show } from "solid-js";
import "../styles.css";
import { IconCornerDownRight } from "../icon";
import { Overflow } from "../overflow";

export function List<T extends any[]>(props: {
  each: T;
  // eslint-disable-next-line no-unused-vars
  children: (item: T[number], index: number) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
  suffix?: (item: T[number]) => JSX.Element;
}) {
  return (
    <Show when={props.each.length > 0}>
      <ol class="min-w-0">
        <For each={props.each}>
          {(item, index) => (
            <li class="flex items-center gap-0.5">
              <div class="min-w-0">{props.children(item, index())}</div>
              <Show when={props.suffix}>
                {(suffix) => <>{suffix()(item)}</>}
              </Show>
            </li>
          )}
        </For>
      </ol>
    </Show>
  );
}

interface ListAdditionalItemProps {
  index: number;
  children: JSX.Element;
}

export const ListAdditionalItem: Component<ListAdditionalItemProps> = (
  props,
) => {
  return (
    <div class="flex min-w-0 items-center justify-center gap-1">
      <Show when={props.index > 0}>
        <div class="flex-none">
          <IconCornerDownRight />
        </div>
      </Show>

      <Overflow>{props.children}</Overflow>
    </div>
  );
};
