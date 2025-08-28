import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { For, JSX, Match, Show, Suspense, Switch } from "solid-js";
import { IconAlert, IconThumbsDown, IconThumbsUp } from "../icon";
import { Source } from "../source";

export function AlertBannerBlacklist(props: {
  lang: string;
  blocked?: common.Information<boolean>;
}) {
  return (
    <Suspense>
      <Show when={props.blocked}>
        {(blocked) => (
          <Show when={blocked().value}>
            <AlertBanner type="bad">
              {i18n("Known to be malicious", props.lang)}

              <Source lang={props.lang} information={blocked()} type="bad" />
            </AlertBanner>
          </Show>
        )}
      </Show>
    </Suspense>
  );
}

export function AlertBannerPlatform(props: {
  lang: string;
  platforms?: common.Information<common.Platform>[];
}) {
  return (
    <Suspense>
      <Show when={props.platforms}>
        {(platforms) => (
          <>
            <Show
              when={platforms().filter(
                (platform) => platform.value === "disposable_email",
              )}
            >
              {(disposableEmailPlatforms) => (
                <Show when={disposableEmailPlatforms().length > 0}>
                  <AlertBanner type="warning">
                    {i18n("Known to provide disposable email", props.lang)}
                    <For each={disposableEmailPlatforms()}>
                      {(disposableEmailPlatform) => (
                        <Source
                          lang={props.lang}
                          information={disposableEmailPlatform}
                          type="warning"
                        />
                      )}
                    </For>
                  </AlertBanner>
                </Show>
              )}
            </Show>
            <Show
              when={platforms().filter(
                (platform) => platform.value === "url_shortener",
              )}
            >
              {(urlShortenerPlatforms) => (
                <Show when={urlShortenerPlatforms().length > 0}>
                  <AlertBanner type="warning">
                    {i18n("Known to shorten URL", props.lang)}
                    <For each={urlShortenerPlatforms()}>
                      {(urlShortenerPlatform) => (
                        <Source
                          lang={props.lang}
                          information={urlShortenerPlatform}
                          type="warning"
                        />
                      )}
                    </For>
                  </AlertBanner>
                </Show>
              )}
            </Show>
          </>
        )}
      </Show>
    </Suspense>
  );
}

export function AlertBannerCertificate(props: {
  lang: string;
  types?: common.Information<string>[];
}) {
  return (
    <Suspense>
      <Show when={props.types}>
        {(types) => (
          <>
            <Show when={types().filter((type) => type.value === "EV")}>
              {(evCertificates) => (
                <Show when={evCertificates().length > 0}>
                  <AlertBanner type="good">
                    {i18n("Legitimacy formally verified", props.lang)}
                    <For each={evCertificates()}>
                      {(evCertificate) => (
                        <Source
                          lang={props.lang}
                          information={evCertificate}
                          type="good"
                        />
                      )}
                    </For>
                  </AlertBanner>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "OV")}>
              {(ovCertificates) => (
                <Show when={ovCertificates().length > 0}>
                  <AlertBanner type="good">
                    {i18n("Organization verified", props.lang)}
                    <For each={ovCertificates()}>
                      {(ovCertificate) => (
                        <Source
                          lang={props.lang}
                          information={ovCertificate}
                          type="good"
                        />
                      )}
                    </For>
                  </AlertBanner>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "IV")}>
              {(ivCertificates) => (
                <Show when={ivCertificates().length > 0}>
                  <AlertBanner type="good">
                    {i18n("Individual verified", props.lang)}
                    <For each={ivCertificates()}>
                      {(ivCertificate) => (
                        <Source
                          lang={props.lang}
                          information={ivCertificate}
                          type="good"
                        />
                      )}
                    </For>
                  </AlertBanner>
                </Show>
              )}
            </Show>
          </>
        )}
      </Show>
    </Suspense>
  );
}

function AlertBanner(props: {
  type: "good" | "warning" | "bad";
  children: JSX.Element;
}) {
  return (
    <div class="mb-2 flex items-center justify-center">
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
        <Match when={props.type === "warning"}>
          <div class="bg-warning/10 border-gowarningod/25 text-warning rounded-lg border px-2.5 py-1.5">
            <div class="flex items-center justify-center gap-0.5">
              <div class="p-1">
                <IconAlert />
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
    </div>
  );
}

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
