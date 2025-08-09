import * as common from "@istrust/common";
import { For, Match, Show, Switch } from "solid-js";
import { Country } from "../country";
import {
  IconBadgeCheck,
  IconBadgeQuestion,
  IconExternalLink,
  IconInfo,
} from "../icon";
import { List } from "../list";
import { Popover } from "../popover";

export function SourceInfo(props: {
  information: common.Information<unknown>;
  locale: Intl.LocalesArgument;
  type?: "good" | "bad";
}) {
  return (
    <Popover
      trigger={<IconInfo />}
      triggerClass={
        props.type === "good"
          ? "hover:bg-good/10"
          : props.type === "bad"
            ? "hover:bg-bad/10"
            : "hover:bg-container-darker"
      }
    >
      <Show when={props.information.sources}>
        {(sources) => (
          <>
            Information provided by{" "}
            <Sources sources={sources()} locale={props.locale} />
          </>
        )}
      </Show>
    </Popover>
  );
}

export function SourceVerification(props: {
  information: common.Information<unknown>;
  locale: Intl.LocalesArgument;
  type?: "good" | "bad";
}) {
  return (
    <Popover
      trigger={
        <Switch>
          <Match when={props.information.verified === true}>
            <IconBadgeCheck />
          </Match>
          <Match when={props.information.verified === false}>
            <IconBadgeQuestion />
          </Match>
        </Switch>
      }
      triggerClass={
        props.type === "good"
          ? "hover:bg-good/10"
          : props.type === "bad"
            ? "hover:bg-bad/10"
            : "hover:bg-container-darker"
      }
    >
      <Switch>
        <Match when={props.information.verified === false}>
          Information without verification
        </Match>
        <Match when={props.information.verified === true}>
          Information have been verified
          <Show when={props.information.sources}>
            {(sources) => (
              <>
                {" "}
                by <Sources sources={sources()} locale={props.locale} />
              </>
            )}
          </Show>
        </Match>
      </Switch>
    </Popover>
  );
}

function Sources(props: {
  sources: common.Information<unknown>["sources"];
  locale: Intl.LocalesArgument;
}) {
  return (
    <List each={props.sources}>
      {(source) => (
        <div class="flex items-center gap-1">
          <Show when={source.organization}>
            {(organization) => <>{organization()}</>}
          </Show>
          <Show when={source.country}>
            {(country) => (
              <Country type="icon" value={country()} locale={props.locale} />
            )}
          </Show>
          <Show when={source.links}>
            {(links) => (
              <For each={links()}>
                {(link) => (
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <IconExternalLink />
                  </a>
                )}
              </For>
            )}
          </Show>
        </div>
      )}
    </List>
  );
}
