import * as common from "@istrust/common";
import { Match, Switch } from "solid-js";
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

  const issueFeature = (errorMessage: string) => {
    return `# Is your feature request related to a problem?
${errorMessage}

# Describe the solution you'd like
A clear and concise description of what you want to happen.

# Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

# Additional context
Add any other context or screenshots about the feature request here.
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
        <Match when={(props.error.name as common.ErrorType) === "FeatureError"}>
          <a
            class="ring-border bg-container hover:bg-container-darker pointer-events-auto flex items-center gap-1.5 rounded-md border-0 px-2.5 py-1.5 text-sm font-medium ring transition-colors ring-inset"
            href={issueURL("enhancement", issueFeature(props.error.message))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Request feature
            <IconGithub />
          </a>
        </Match>
        <Match when={(props.error.name as common.ErrorType) !== "UserError"}>
          <div class="flex flex-col items-center justify-center gap-2 py-4">
            <p>{props.error.message}</p>
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
