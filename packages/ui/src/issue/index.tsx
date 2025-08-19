import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { JSX, Match, onMount, Switch } from "solid-js";
import { isServer } from "solid-js/web";
import { IconGithub } from "../icon";

function issueBug(errorMessage: string) {
  const hostname = isServer ? undefined : window.location.hostname;
  const protocol = isServer ? undefined : window.location.protocol;

  return `# Scope
Where did the error happened

- [${hostname !== undefined && hostname.endsWith("istrust.org") ? "x" : " "}] istrust.org
- [ ] webextension
    - [${protocol === "chrome-extension:" ? "x" : " "}] chrome
    - [${protocol === "moz-extension:" ? "x" : " "}] firefox
    - [ ] safari
    - [${protocol === "edge-extension:" ? "x" : " "}] edge

# Input URL or domain name


# Error message
${errorMessage}
`;
}

function issueFeature(errorMessage: string) {
  return `# Is your feature request related to a problem?
${errorMessage}

# Describe the solution you'd like
A clear and concise description of what you want to happen.

# Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

# Additional context
Add any other context or screenshots about the feature request here.
`;
}

function issueURL(labels: string, body: string) {
  const encodedBody = encodeURIComponent(body).replace(
    /[-_.!~*'() ]/,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  // https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query
  return `https://github.com/Internet-Society-Belgium/isTrust/issues/new?labels=${labels}&body=${encodedBody}`;
}

export function Issue(props: { lang: string; error: Error }) {
  onMount(() => {
    console.error(props.error);
  });

  return (
    <Switch>
      <Match when={(props.error.name as common.ErrorType) === "UserError"}>
        <div class="text-bad flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            class=""
            data-copyright="Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 16h.01M12 8v4m3.312-10a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"
            />
          </svg>
          <p>{props.error.message}</p>
        </div>
      </Match>
      <Match
        when={
          (props.error.name as common.ErrorType) ===
          "FeatureRequireWebextensionError"
        }
      >
        <IssueFeatureOnlyAvailableIn
          lang={props.lang}
          platform={i18n("the extension", props.lang)}
        />
      </Match>
      <Match
        when={(props.error.name as common.ErrorType) === "FeatureMissingError"}
      >
        <IssueFeatureMissing lang={props.lang} message={props.error.message} />
      </Match>
      <Match when={true}>
        <IssueUnexpectedError lang={props.lang} message={props.error.message} />
      </Match>
    </Switch>
  );
}

export function IssueFeatureOnlyAvailableIn(props: {
  lang: string;
  platform: string;
}) {
  return (
    <IssueButton href="https://istrust.org/#get">
      {i18n("Only available in", props.lang)} {props.platform}
    </IssueButton>
  );
}

export function IssueFeatureNotAvailableIn(props: {
  lang: string;
  platform: string;
}) {
  return (
    <IssueButton href="https://istrust.org/#get">
      {i18n("Not available in", props.lang)} {props.platform}
    </IssueButton>
  );
}

export function IssueFeatureMissing(props: { lang: string; message: string }) {
  return (
    <IssueButton
      href={issueURL("enhancement", issueFeature(props.message))}
      target="_blank"
    >
      {i18n("Feature not available", props.lang)}
      <IconGithub />
    </IssueButton>
  );
}

export function IssueUnexpectedError(props: { lang: string; message: string }) {
  return (
    <IssueButton
      href={issueURL("bug", issueBug(props.message))}
      target="_blank"
    >
      {i18n("Unexpected error", props.lang)}
      <IconGithub />
    </IssueButton>
  );
}

function IssueButton(props: {
  href: string;
  children: JSX.Element;
  target?: "_blank";
}) {
  return (
    <div class="bg-container/75 absolute inset-0 top-0 z-1">
      <div class="flex h-full items-center justify-center">
        <a
          href={props.href}
          class="ring-border bg-container hover:bg-container-darker pointer-events-auto flex items-center gap-1 rounded-md border-0 px-1.5 py-0.5 text-sm font-medium text-nowrap shadow ring transition-colors ring-inset"
          target={props.target}
        >
          {props.children}
        </a>
      </div>
    </div>
  );
}
