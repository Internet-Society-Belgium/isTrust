import * as common from "@istrust/common";
import {
  For,
  JSX,
  Match,
  Show,
  Suspense,
  Switch,
  type Component,
} from "solid-js";
import { IconThumbsDown, IconThumbsUp } from "../icon";
import { SourceVerification } from "../source";

interface CertificateAlertProps {
  types?: common.Information<unknown>[];
}

export const CertificateAlert: Component<CertificateAlertProps> = (props) => {
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
                      <p>Legitimacy formally verified</p>
                      <For each={evCertificates()}>
                        {(evCertificate) => (
                          <SourceVerification
                            information={evCertificate}
                            locale={navigator.language}
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
                      <p>Organization legitimacy verified</p>
                      <For each={ovCertificates()}>
                        {(ovCertificate) => (
                          <SourceVerification
                            information={ovCertificate}
                            locale={navigator.language}
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
                      <p>Individual legitimacy verified</p>
                      <For each={ivCertificates()}>
                        {(ivCertificate) => (
                          <SourceVerification
                            information={ivCertificate}
                            locale={navigator.language}
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
};

interface AlertProps {
  type: "good" | "bad";
  children: JSX.Element;
}

const Alert: Component<AlertProps> = (props) => {
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
};
