import { Match, Switch, type Component } from "solid-js";
import "../styles.css";

type Scope = "istrust.org" | "chrome" | "firefox" | "edge" | "safari";

interface Props {
  query: string;
  scope: Scope;
  error: Error;
}

export const Issue: Component<Props> = (props) => {
  const issueBug = (scope: Scope, query: string, errorMessage: string) => {
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
            class="ring-border bg-container hover:bg-container-darker flex items-center gap-1.5 rounded-md border-0 px-2.5 py-1.5 text-sm font-medium ring transition-colors ring-inset"
            href={issueURL("enhancement", issueFeature(props.error.message))}
          >
            Request feature
            <GithubIcon />
          </a>
        </Match>
        <Match when={props.error.name !== "UserError"}>
          <a
            class="ring-border bg-container hover:bg-container-darker flex items-center gap-1.5 rounded-md border-0 px-2.5 py-1.5 text-sm font-medium ring transition-colors ring-inset"
            href={issueURL(
              "bug",
              issueBug(props.scope, props.query, props.error.message),
            )}
          >
            Report bug
            <GithubIcon />
          </a>
        </Match>
      </Switch>
    </div>
  );
};

const GithubIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 98 96"
    >
      {/* Icon from GitHub - https://github.com/logos */}
      <path
        fill="#24292f" // #fff
        fill-rule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        clip-rule="evenodd"
      />
    </svg>
  );
};
