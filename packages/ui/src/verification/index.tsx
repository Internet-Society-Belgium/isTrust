import { For, Match, Show, Switch, type Component } from "solid-js";
import "../styles.css";
import { Data } from "@istrust/common";
import { Tooltip } from "../tooltip";
import { Country } from "../country";

interface Props extends Pick<Data<any>, "verification"> {
  locale: Intl.LocalesArgument;
}

export const Verification: Component<Props> = (props) => {
  return (
    <div class="inline-flex align-text-top">
      <div class="mx-1">
        <Tooltip
          trigger={
            <Switch>
              <Match when={props.verification.status === "verified"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76" />
                    <path d="m9 12l2 2l4-4" />
                  </g>
                </svg>
              </Match>
              <Match when={props.verification.status === "unverified"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  >
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" />
                  </g>
                </svg>
              </Match>
            </Switch>
          }
        >
          <For each={props.verification.authority}>
            {(authority) => (
              <>
                <Show when={authority.organization}>
                  {(organization) => <>{organization()}</>}
                </Show>
                <Show when={authority.country}>
                  {(country) => (
                    <Country value={country()} locale={props.locale} />
                  )}
                </Show>
                <Show when={authority.links}>
                  {(links) => <For each={links()}>{(link) => <>{link}</>}</For>}
                </Show>
              </>
            )}
          </For>
        </Tooltip>
      </div>
    </div>
  );
};
