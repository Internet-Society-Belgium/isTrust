import i18n from "@istrust/i18n";
import { Show } from "solid-js";

export function FooterWebsiteAvailability(props: {
  base?: string;
  lang: string;
  query: string | undefined;
}) {
  return (
    <div class="mt-2 flex items-center justify-center">
      <p class="text-muted text-xs">
        <span>{i18n("Also available on", props.lang)} </span>

        <Show
          when={props.query}
          fallback={
            <a href="https://istrust.org/" class="underline" target="_blank">
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
      </p>
    </div>
  );
}
