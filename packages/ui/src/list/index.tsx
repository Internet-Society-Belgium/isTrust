import { For, JSX, Show } from "solid-js";
import "../styles.css";
import { Overflow } from "../overflow";

export function List<T extends any[]>(props: {
  each: T;
  // eslint-disable-next-line no-unused-vars
  children: (item: T[number]) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
  suffix?: (item: T[number]) => JSX.Element;
}) {
  return (
    <Show when={props.each.length > 0}>
      <ol class="min-w-0">
        <For each={props.each}>
          {(item) => (
            <li class="flex items-center gap-1">
              <Overflow>
                <p>{props.children(item)}</p>
              </Overflow>
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
