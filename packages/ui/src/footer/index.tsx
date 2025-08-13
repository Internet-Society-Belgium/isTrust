import { Match, Show, Switch } from "solid-js";

export function FooterAvailability(props: {
  on: "website" | "webextension";
  query: string | undefined;
}) {
  return (
    <div class="mt-2 flex items-center justify-center">
      <p class="text-muted">
        <span>Also available on </span>
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
                  href={`https://istrust.org/?q=${new URL(query()).hostname}`}
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
