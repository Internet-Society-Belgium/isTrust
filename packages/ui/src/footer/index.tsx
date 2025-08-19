import i18n from "@istrust/i18n";
import { Match, Show, Switch } from "solid-js";

export function FooterAvailability(props: {
  lang: string;
  on: "website" | "webextension";
  query: string | undefined;
}) {
  return (
    <div class="mt-2 flex items-center justify-center">
      <p class="text-muted text-xs">
        <span>{i18n("Also available on", props.lang)} </span>
        <Switch>
          <Match when={props.on === "website"}>
            <Show
              when={props.query}
              fallback={
                <a
                  href="https://istrust.org/"
                  class="underline"
                  target="_blank"
                >
                  istrust.org
                </a>
              }
            >
              {(query) => (
                <a
                  href={`https://istrust.org/?q=${query()}`}
                  class="underline"
                  target="_blank"
                >
                  istrust.org
                </a>
              )}
            </Show>
          </Match>
        </Switch>
      </p>
    </div>
  );
}
