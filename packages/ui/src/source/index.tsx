import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
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
  lang: string;
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
              <span>{i18n("Information provided", props.lang)}</span>
              <div class="flex items-center gap-1">
                <span>{i18n("by", props.lang)}</span>
                <Sources lang={props.lang} sources={sources()} />
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
  lang: string;
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
            <IconAlert /> {i18n("Information without verification", props.lang)}
          </div>
          <Show when={props.information.sources.length > 0}>
            <Show when={props.information.sources}>
              {(sources) => (
                <div class="flex items-center gap-1">
                  <span>{i18n("from", props.lang)}</span>
                  <Sources lang={props.lang} sources={sources()} />
                </div>
              )}
            </Show>
          </Show>
        </Match>
        <Match when={props.information.verified}>
          {i18n("Information have been verified", props.lang)}
          <Show when={props.information.sources.length > 0}>
            <Show when={props.information.sources}>
              {(sources) => (
                <div class="flex items-center gap-1">
                  <span>{i18n("by", props.lang)}</span>
                  <Sources lang={props.lang} sources={sources()} />
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
  lang: string;
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
              <Country lang={props.lang} type="icon" value={country()} />
            )}
          </Show>
          <Show when={source.links}>
            {(links) => (
              <For each={links()}>
                {(link) => (
                  <a href={link} target="_blank">
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
