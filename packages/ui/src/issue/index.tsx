import * as common from "@istrust/common";
import { Match, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { IconGithub } from "../icon";

export function Issue(props: { error: Error }) {
  const issueBug = (errorMessage: string) => {
    return `# Scope
Where did the error happened

- [${window.location.hostname === "istrust.org" ? "x" : " "}] istrust.org
- [ ] webextension
    - [${window.location.protocol === "chrome-extension:" ? "x" : " "}] chrome
    - [${window.location.hostname === "moz-extension:" ? "x" : " "}] firefox
    - [ ] safari
    - [${window.location.protocol === "edge-extension:" ? "x" : " "}] edge

# Input URL or domain name


# Error message
${errorMessage}
`;
  };

  const issueURL = (labels: string, body: string) => {
    const encodedBody = encodeURIComponent(body).replace(
      /[-_.!~*'() ]/,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );

    // https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query
    return `https://github.com/Internet-Society-Belgium/isTrust/issues/new?labels=${labels}&body=${encodedBody}`;
  };

  return (
    <>
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
        <Match when={true}>
          <div class="flex flex-col items-center justify-center gap-2 py-4">
            <p>Unexpected error</p>
            <a
              class="ring-border bg-container hover:bg-container-darker pointer-events-auto flex items-center gap-1.5 rounded-md border-0 px-2.5 py-1.5 text-sm font-medium ring transition-colors ring-inset"
              href={issueURL("bug", issueBug(props.error.message))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Report bug
              <IconGithub />
            </a>
          </div>
        </Match>
      </Switch>
    </>
  );
}
