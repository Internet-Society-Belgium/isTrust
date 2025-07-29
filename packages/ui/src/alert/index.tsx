import { JSX, Match, Switch, type Component } from "solid-js";
import "../styles.css";

interface Props {
  type: "good" | "bad";
  children: JSX.Element;
}

export const Alert: Component<Props> = (props) => {
  return (
    <Switch>
      <Match when={props.type === "good"}>
        <div class="bg-good/10 border-good/25 text-good rounded-lg border px-2.5 py-1.5">
          <div class="flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 10v12m8-16.12L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88"
              />
            </svg>

            {props.children}
          </div>
        </div>
      </Match>
      <Match when={props.type === "bad"}>
        <div class="bg-bad/10 border-bad/25 text-bad rounded-lg border px-2.5 py-1.5">
          <div class="flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 14V2M9 18.12L10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88"
              />
            </svg>

            {props.children}
          </div>
        </div>
      </Match>
    </Switch>
  );
};
