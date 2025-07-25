import { For, JSX, Show } from "solid-js";
import "../styles.css";

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
              <div class="min-w-0">
                <p
                  style={{
                    overflow: "scroll",
                    "text-overflow": "ellipsis ellipsis",
                    "white-space": "nowrap",
                  }}
                >
                  {props.children(item)}
                </p>
              </div>
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
