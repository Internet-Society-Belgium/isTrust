import { For, Match, Show, Switch, type Component } from "solid-js";
import "../styles.css";
import * as common from "@istrust/common";
import { Country } from "../country";
import { IconBadgeCheck, IconBadgeQuestion, IconExternalLink } from "../icon";
import { List } from "../list";
import { Popover } from "../popover";

interface Props {
  verification: common.Data<unknown>["verification"];
  locale: Intl.LocalesArgument;
  type?: "good" | "bad";
}

export const Verification: Component<Props> = (props) => {
  return (
    <Popover
      trigger={
        <Switch>
          <Match when={props.verification.status === "verified"}>
            <IconBadgeCheck />
          </Match>
          <Match when={props.verification.status === "unverified"}>
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
        <Match when={props.verification.status === "unverified"}>
          Information could not be verified
        </Match>
        <Match when={props.verification.status === "verified"}>
          Information have been verified
        </Match>
      </Switch>

      <Show when={props.verification.authorities}>
        {(authorities) => (
          <>
            {" "}
            by{" "}
            <List each={authorities()}>
              {(authority) => (
                <div class="flex items-center gap-1">
                  <Show when={authority.organization}>
                    {(organization) => <>{organization()}</>}
                  </Show>
                  <Show when={authority.country}>
                    {(country) => (
                      <Country
                        type="icon"
                        value={country()}
                        locale={props.locale}
                      />
                    )}
                  </Show>
                  <Show when={authority.links}>
                    {(links) => (
                      <For each={links()}>
                        {(link) => (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink />
                          </a>
                        )}
                      </For>
                    )}
                  </Show>
                </div>
              )}
            </List>
          </>
        )}
      </Show>
    </Popover>
  );
};
