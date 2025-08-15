import * as common from "@istrust/common";
import { For, Match, Show, Switch } from "solid-js";
import { Country } from "../country";
import {
  IconAlert,
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
    <Show when={props.information.sources.length > 0}>
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
              <span>Information provided</span>
              <div class="flex items-center gap-1">
                <span>by</span>
                <Sources sources={sources()} locale={props.locale} />
              </div>
            </>
          )}
        </Show>
      </Popover>
    </Show>
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
          <Match when={props.information.verified}>
            <IconBadgeCheck />
          </Match>
          <Match when={!props.information.verified}>
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
        <Match when={!props.information.verified}>
          <div class="flex items-center gap-1">
            <IconAlert /> Information without verification
          </div>
          <Show when={props.information.sources.length > 0}>
            <Show when={props.information.sources}>
              {(sources) => (
                <div class="flex items-center gap-1">
                  <span>from</span>
                  <Sources sources={sources()} locale={props.locale} />
                </div>
              )}
            </Show>
          </Show>
        </Match>
        <Match when={props.information.verified}>
          Information have been verified
          <Show when={props.information.sources.length > 0}>
            <Show when={props.information.sources}>
              {(sources) => (
                <div class="flex items-center gap-1">
                  <span>by</span>
                  <Sources sources={sources()} locale={props.locale} />
                </div>
              )}
            </Show>
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
