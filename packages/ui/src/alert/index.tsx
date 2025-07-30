import {
  For,
  JSX,
  Match,
  Show,
  Suspense,
  Switch,
  type Component,
} from "solid-js";
import "../styles.css";
import * as common from "@istrust/common";
import { IconThumbsDown, IconThumbsUp } from "../icon";
import { Verification } from "../verification";

interface CertificateAlertProps {
  types: common.Data<unknown>[] | null | undefined;
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
                      Legitimacy formally verified
                      <For each={evCertificates()}>
                        {(evCertificate) => (
                          <Verification
                            verification={evCertificate.verification}
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
                      Organization legitimacy verified
                      <For each={ovCertificates()}>
                        {(ovCertificate) => (
                          <Verification
                            verification={ovCertificate.verification}
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
                      Individual legitimacy verified
                      <For each={ivCertificates()}>
                        {(ivCertificate) => (
                          <Verification
                            verification={ivCertificate.verification}
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
