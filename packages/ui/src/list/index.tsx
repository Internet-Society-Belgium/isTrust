import { For, JSX, Show } from "solid-js";
import { Data } from "@istrust/common";
import "../styles.css";

export function List<T extends Data<any>[]>(props: {
  each: T;
  // eslint-disable-next-line no-unused-vars
  children: (item: T[number]) => JSX.Element;
  // eslint-disable-next-line no-unused-vars
  suffix?: (item: T[number]) => JSX.Element;
}) {
  const filter = (data: T) => {
    const unique = new Set(data).values().toArray();

    const verified = unique.filter((u) => u.verification.status === "verified");
    if (verified.length > 0) return verified;

    return unique;
  };

  return (
    <ol class="min-w-0">
      <For each={filter(props.each)}>
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
            <Show when={props.suffix}>{(suffix) => <>{suffix()(item)}</>}</Show>
          </li>
        )}
      </For>
    </ol>
  );
}
