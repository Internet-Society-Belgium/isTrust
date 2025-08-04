import { For, Match, Show, Switch, type Component } from "solid-js";
import "../styles.css";
import * as common from "@istrust/common";
import { Country } from "../country";
import {
  IconBadgeCheck,
  IconBadgeQuestion,
  IconExternalLink,
  IconInfo,
} from "../icon";
import { List } from "../list";
import { Popover } from "../popover";

interface SourceInfoProps {
  information: common.Information<unknown>;
  locale: Intl.LocalesArgument;
  type?: "good" | "bad";
}

export const SourceInfo: Component<SourceInfoProps> = (props) => {
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
};

interface SourceVerificationProps {
  information: common.Information<unknown>;
  locale: Intl.LocalesArgument;
  type?: "good" | "bad";
}

export const SourceVerification: Component<SourceVerificationProps> = (
  props,
) => {
  return (
    <Popover
      trigger={
        <Switch>
          <Match when={props.information.verification?.verified === true}>
            <IconBadgeCheck />
          </Match>
          <Match when={props.information.verification?.verified === false}>
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
        <Match when={props.information.verification?.verified === false}>
          Information without verification
        </Match>
        <Match when={props.information.verification?.verified === true}>
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
};

interface SourcesProps {
  sources: common.Information<unknown>["sources"];
  locale: Intl.LocalesArgument;
}

const Sources: Component<SourcesProps> = (props) => {
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
};
