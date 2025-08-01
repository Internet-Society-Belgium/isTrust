import { Match, Switch, type Component } from "solid-js";
import "../styles.css";
import { IconGithub } from "../icon";

type Scope = "istrust.org" | "chrome" | "firefox" | "edge" | "safari";

interface Props {
  query: string;
  scope: Scope | null;
  error: Error;
}

export const Issue: Component<Props> = (props) => {
  const issueBug = (
    scope: Scope | null,
    query: string,
    errorMessage: string,
  ) => {
    return `# Scope
Where did the error happened

- [${scope === "istrust.org" ? "x" : " "}] istrust.org
- [ ] webextension
    - [${scope === "chrome" ? "x" : " "}] chrome
    - [${scope === "firefox" ? "x" : " "}] firefox
    - [${scope === "safari" ? "x" : " "}] safari
    - [${scope === "edge" ? "x" : " "}] edge

# Input URL or domain name
${query}

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
    <div class="flex flex-col items-center justify-center gap-2 py-4">
      <p>{props.error.message}</p>
      <Switch>
        <Match when={props.error.name === "FeatureError"}>
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
        <Match when={props.error.name !== "UserError"}>
          <a
            class="ring-border bg-container hover:bg-container-darker pointer-events-auto flex items-center gap-1.5 rounded-md border-0 px-2.5 py-1.5 text-sm font-medium ring transition-colors ring-inset"
            href={issueURL(
              "bug",
              issueBug(props.scope, props.query, props.error.message),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Report bug
            <IconGithub />
          </a>
        </Match>
      </Switch>
    </div>
  );
};
