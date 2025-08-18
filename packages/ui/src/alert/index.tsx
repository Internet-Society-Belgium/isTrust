import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { For, JSX, Match, Show, Suspense, Switch } from "solid-js";
import { IconThumbsDown, IconThumbsUp } from "../icon";
import { SourceVerification } from "../source";

export function CertificateAlert(props: {
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
                    <Alert type="good">
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
                    </Alert>
                  </div>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "OV")}>
              {(ovCertificates) => (
                <Show when={ovCertificates().length > 0}>
                  <div class="mb-2 flex items-center justify-center">
                    <Alert type="good">
                      {i18n("Organization legitimacy verified", props.lang)}
                      <For each={ovCertificates()}>
                        {(ovCertificate) => (
                          <SourceVerification
                            lang={props.lang}
                            information={ovCertificate}
                            type="good"
                          />
                        )}
                      </For>
                    </Alert>
                  </div>
                </Show>
              )}
            </Show>

            <Show when={types().filter((type) => type.value === "IV")}>
              {(ivCertificates) => (
                <Show when={ivCertificates().length > 0}>
                  <div class="mb-2 flex items-center justify-center">
                    <Alert type="good">
                      {i18n("Individual legitimacy verified", props.lang)}
                      <For each={ivCertificates()}>
                        {(ivCertificate) => (
                          <SourceVerification
                            lang={props.lang}
                            information={ivCertificate}
                            type="good"
                          />
                        )}
                      </For>
                    </Alert>
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

function Alert(props: { type: "good" | "bad"; children: JSX.Element }) {
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
