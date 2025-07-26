import { JSX, Suspense, type Component } from "solid-js";
import "../styles.css";

interface SectionProps {
  title: string;
  children: JSX.Element;
}

export const Section: Component<SectionProps> = (props) => {
  return (
    <>
      <div class="align-center flex w-full items-center text-center">
        <div class="border-border w-full border-t border-solid" />
        <div class="text-default mx-3 flex font-medium whitespace-nowrap">
          <span class="text-sm">{props.title}</span>
        </div>
        <div class="border-border w-full border-t border-solid" />
      </div>
      {props.children}
    </>
  );
};

interface SectionItemProps {
  title: string;
  prefix: JSX.Element;
  children: JSX.Element;
}

export const SectionItem: Component<SectionItemProps> = (props) => {
  return (
    <div class="flex items-center gap-2">
      <div title={props.title}>{props.prefix}</div>
      <Suspense fallback={<span>Loading...</span>}>{props.children}</Suspense>
    </div>
  );
};
