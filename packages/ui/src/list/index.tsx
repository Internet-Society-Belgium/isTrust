import { For, JSX } from "solid-js";
import { Data } from "@istrust/common";
import "../styles.css";

export function List<T extends Data<any>[]>(props: {
  each: T;
  // eslint-disable-next-line no-unused-vars
  children: (item: T[number]) => JSX.Element;
}) {
  const removeDuplicates = (data: T) => {
    return new Set(data).values().toArray();
  };

  return (
    <ol>
      <For each={removeDuplicates(props.each)}>
        {(item) => (
          <li class="flex-col gap-1">
            {props.children(item)}
            <p>{`(${item.verification.status})`}</p>
          </li>
        )}
      </For>
    </ol>
  );
}
