import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { For, JSX, Match, Show, Suspense, Switch } from "solid-js";
import { IconThumbsDown, IconThumbsUp } from "../icon";
import { SourceVerification } from "../source";

export function AlertRegistration(props: {
  lang: string;
  date: string;
  children: JSX.Element;
}) {
  const previousYear = new Date().setFullYear(new Date().getFullYear() - 1);
  const previousSixMonth = new Date().setMonth(new Date().getMonth() - 6);

  return (
    <Switch>
      <Match when={new Date(props.date).getTime() > previousSixMonth}>
        <div
          class="text-bad"
          title={i18n("Registered less than 6 months ago", props.lang)}
        >
          {props.children}
        </div>
      </Match>
      <Match when={new Date(props.date).getTime() > previousYear}>
        <div
          class="text-warning"
          title={i18n("Registered less than 1 year ago", props.lang)}
        >
          {props.children}
        </div>
      </Match>
      <Match when={true}>{props.children}</Match>
    </Switch>
  );
}

export function AlertFirstVisit(props: {
  lang: string;
  firstVisit?: string;
  children: JSX.Element;
}) {
  const today = new Date();

  return (
    <Switch>
      <Match when={props.firstVisit === undefined}>
        <div class="text-warning">{i18n("Never visited", props.lang)}</div>
      </Match>
      <Match
        when={
          props.firstVisit === undefined ||
          new Date(props.firstVisit).toDateString() === today.toDateString()
        }
      >
        <div
          class="text-warning"
          title={i18n("First visited less than 1 day ago", props.lang)}
        >
          {props.children}
        </div>
      </Match>
      <Match when={true}>{props.children}</Match>
    </Switch>
  );
}

export function AlertVisitFrequency(props: {
  lang: string;
  firstVisit?: string;
  children: JSX.Element;
}) {
  const today = new Date();

  return (
    <Switch>
      <Match
        when={
          props.firstVisit === undefined ||
          new Date(props.firstVisit).toDateString() === today.toDateString()
        }
      >
        <div title={i18n("First visited less than 1 day ago", props.lang)}>
          {i18n("Not enough history", props.lang)}
        </div>
      </Match>
      <Match when={true}>{props.children}</Match>
    </Switch>
  );
}

export function AlertBannerCertificate(props: {
  lang: string;
  types?: common.Information<unknown>[];
}) {
  return (
    <Suspense>
      <Show when={props.types}>
        {(types) => (
          <>
            <Show when={types().filter((type) => type.value === "EV")}>
              {(evCertificates) => (
                <Show when={evCertificates().length > 0}>
                  <div class="mb-2 flex items-center justify-center">
                    <AlertBanner type="good">
                      {i18n("Legitimacy formally verified", props.lang)}
                      <For each={evCertificates()}>
                        {(evCertificate) => (
                          <SourceVerification
                            lang={props.lang}
                            information={evCertificate}
                            type="good"
                          />
                        )}
                      </For>
                    </AlertBanner>
                  </div>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "OV")}>
              {(ovCertificates) => (
                <Show when={ovCertificates().length > 0}>
                  <div class="mb-2 flex items-center justify-center">
                    <AlertBanner type="good">
                      {i18n("Organization verified", props.lang)}
                      <For each={ovCertificates()}>
                        {(ovCertificate) => (
                          <SourceVerification
                            lang={props.lang}
                            information={ovCertificate}
                            type="good"
                          />
                        )}
                      </For>
                    </AlertBanner>
                  </div>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "IV")}>
              {(ivCertificates) => (
                <Show when={ivCertificates().length > 0}>
                  <div class="mb-2 flex items-center justify-center">
                    <AlertBanner type="good">
                      {i18n("Individual verified", props.lang)}
                      <For each={ivCertificates()}>
                        {(ivCertificate) => (
                          <SourceVerification
                            lang={props.lang}
                            information={ivCertificate}
                            type="good"
                          />
                        )}
                      </For>
                    </AlertBanner>
                  </div>
                </Show>
              )}
            </Show>
          </>
        )}
      </Show>
    </Suspense>
  );
}

function AlertBanner(props: { type: "good" | "bad"; children: JSX.Element }) {
  return (
    <Switch>
      <Match when={props.type === "good"}>
        <div class="bg-good/10 border-good/25 text-good rounded-lg border px-2.5 py-1.5">
          <div class="flex items-center justify-center gap-0.5">
            <div class="p-1">
              <IconThumbsUp />
            </div>

            {props.children}
          </div>
        </div>
      </Match>
      <Match when={props.type === "bad"}>
        <div class="bg-bad/10 border-bad/25 text-bad rounded-lg border px-2.5 py-1.5">
          <div class="flex items-center justify-center gap-0.5">
            <div class="p-1">
              <IconThumbsDown />
            </div>

            {props.children}
          </div>
        </div>
      </Match>
    </Switch>
  );
}
