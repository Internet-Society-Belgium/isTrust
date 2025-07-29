import { type Component } from "solid-js";
import "../styles.css";

type Scope = "istrust.org" | "chrome" | "firefox" | "edge" | "safari";

interface Props {
  query: string;
  scope: Scope;
  error: Error;
}

export const Issue: Component<Props> = (props) => {
  const issueTemplate = (scope: Scope, query: string, errorMessage: string) => {
    return encodeURIComponent(`# Scope
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
`).replace(
      /[-_.!~*'() ]/,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
  };

  return (
    <div class="flex flex-col items-center justify-center gap-2">
      <p>{props.error.message}</p>
      <a
        // https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query
        href={`https://github.com/Internet-Society-Belgium/isTrust/issues/new?labels=bug&body=${issueTemplate(props.scope, props.query, props.error.message)}`}
      >
        Report on GitHub
      </a>
    </div>
  );
};
