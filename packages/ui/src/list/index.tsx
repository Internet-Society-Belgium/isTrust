import { For, JSX } from "solid-js";
import { Data } from "@istrust/common";
import "../styles.css";

export function List<T extends Data<any>[]>(props: {
  each: T;
  // eslint-disable-next-line no-unused-vars
  children: (item: T[number]) => JSX.Element;
}) {
  const filter = (data: T) => {
    const unique = new Set(data).values().toArray();

    const verified = unique.filter((u) => u.verification.status === "verified");
    if (verified.length > 0) return verified;

    return unique;
  };

  return (
    <ol>
      <For each={filter(props.each)}>
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
