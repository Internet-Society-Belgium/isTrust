import { type Component } from "solid-js";
import "../styles.css";

interface Props {
  error: Error;
}

export const Issue: Component<Props> = (props) => {
  return (
    <div class="flex flex-col items-center justify-center gap-2">
      <p>{props.error.message}</p>
      <a
        // https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query
        href={`https://github.com/Internet-Society-Belgium/isTrust/issues/new?labels=bug&title=New+bug+report&body=${props.error.message}`}
      >
        Report on GitHub
      </a>
    </div>
  );
};
