import {
  createSignal,
  JSX,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
  type Component,
} from "solid-js";
import { Portal } from "solid-js/web";
import "../styles.css";

interface Props {
  trigger: JSX.Element;
  children: JSX.Element;
}

type RectAlign = "top" | "bottom";
type RectJustify = "left" | "center" | "right";

export const Popover: Component<Props> = (props) => {
  const [open, setOpen] = createSignal<boolean>(false);

  const [rect, setRect] = createSignal<{
    align: RectAlign;
    justify: RectJustify;
    anchor: { x: number; y: number };
    content: { x: number; y: number; width: number; height: number };
  }>();

  let trigger!: HTMLButtonElement;
  let content!: HTMLDivElement;

  onMount(() => {
    document.addEventListener("resize", computeRect);
    document.addEventListener("scroll", computeRect);

    document.addEventListener("keydown", keyDown);
    document.addEventListener("click", click);
  });

  onCleanup(() => {
    document.removeEventListener("resize", computeRect);
    document.removeEventListener("scroll", computeRect);

    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("click", click);
  });

  const getTriggerRect = () => {
    const rect = trigger.getBoundingClientRect();

    return {
      y: rect.y + window.scrollY,
      x: rect.x + window.scrollX,
      width: rect.width,
      height: rect.height,
    };
  };

  const computeRect = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const triggerRect = getTriggerRect();

    const marginProportion = 25 / 100;
    const windowWidthMargin = windowWidth * marginProportion;
    const windowHeightMargin = windowHeight * marginProportion;

    const triggerWindowHeightProportion = triggerRect.y / windowHeight;

    const align: RectAlign =
      triggerWindowHeightProportion < 0.5 ? "top" : "bottom";

    const arrowMargin = 10;

    const safeX = Math.min(triggerRect.x - arrowMargin, windowWidthMargin);
    const safeY =
      align === "top" ? windowHeightMargin : triggerRect.y + triggerRect.height;
    const safeWidth =
      windowWidth -
      safeX -
      Math.min(
        windowWidth - (triggerRect.x + triggerRect.width + arrowMargin),
        windowWidthMargin,
      );
    const safeHeight =
      align === "top"
        ? triggerRect.y - safeY
        : windowHeight - windowHeightMargin - safeY;

    const triggerSafeWidthProportion = (triggerRect.x - safeX) / safeWidth;
    const justify: RectJustify =
      triggerSafeWidthProportion < 1 / 3
        ? "left"
        : triggerSafeWidthProportion > 2 / 3
          ? "right"
          : "center";

    setRect({
      align,
      justify,
      anchor: {
        x: triggerRect.x + triggerRect.width / 2,
        y: align === "top" ? triggerRect.y : triggerRect.y + triggerRect.height,
      },
      content: {
        x: safeX,
        y: safeY,
        width: safeWidth,
        height: safeHeight,
      },
    });
  };

  const keyDown = (event: KeyboardEvent) => {
    if (open() !== true) return;

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const click = (event: MouseEvent) => {
    if (open() !== true) return;

    const target = event.target as Node;

    if (!trigger.contains(target) && !content.contains(target)) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={trigger}
        onClick={() => {
          if (open() === true) return;

          computeRect();

          setOpen(true);
        }}
        class="h-4 w-4"
      >
        {props.trigger}
      </button>

      <Show when={open() === true}>
        <Show when={rect()}>
          {(rect) => (
            <Portal>
              <Switch>
                <Match when={rect().align === "top"}>
                  <div
                    class="text-border absolute"
                    style={{
                      left: `${rect().anchor.x - 16 / 2}px`,
                      top: `${rect().anchor.y - 8 - 1}px`,
                    }}
                  >
                    <svg
                      width="16px"
                      height="8px"
                      viewBox="0 0 255 127.5"
                      fill="currentColor"
                    >
                      <polygon points="0,0 127.5,127.5 255,0" />
                    </svg>
                  </div>
                </Match>
                <Match when={rect().align === "bottom"}>
                  <div
                    class="text-border absolute"
                    style={{
                      left: `${rect().anchor.x - 16 / 2}px`,
                      top: `${rect().anchor.y + 1}px`,
                    }}
                  >
                    <svg
                      width="16px"
                      height="8px"
                      viewBox="0 0 255 127.5"
                      fill="currentColor"
                    >
                      <polygon points="0,127.5 127.5,0 255,127.5" />
                    </svg>
                  </div>
                </Match>
              </Switch>

              <div
                class="absolute flex"
                style={{
                  left: `${rect().content.x}px`,
                  top: `${rect().content.y + (rect().align === "top" ? 0 : +8 + 1)}px`,
                  width: `${rect().content.width}px`,
                  height: `${rect().content.height + (rect().align === "top" ? -8 - 1 : -8 - 1)}px`,
                  "align-items":
                    rect().align === "top" ? "flex-end" : "flex-start",
                  "justify-content":
                    rect().justify === "left"
                      ? "flex-start"
                      : rect().justify === "right"
                        ? "flex-end"
                        : "center",
                }}
              >
                <div
                  ref={content}
                  class="bg-background ring-border pointer-events-auto rounded-md p-2 shadow-lg ring"
                >
                  {props.children}
                </div>
              </div>
            </Portal>
          )}
        </Show>
      </Show>
    </>
  );
};
