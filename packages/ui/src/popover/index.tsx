import {
  createSignal,
  JSX,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { isServer, Portal } from "solid-js/web";

type RectAlign = "top" | "bottom";
type RectJustify = "left" | "center" | "right";

export function Popover(props: {
  trigger: JSX.Element;
  triggerClass?: string;
  children: JSX.Element;
}) {
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
    document.addEventListener("resize", computeRect, { passive: true });
    document.addEventListener("scroll", computeRect, { passive: true });

    document.addEventListener("keydown", closeOnEscape, { passive: true });
    document.addEventListener("pointerdown", closeOnEvent, {
      passive: true,
    });
    document.addEventListener("focus", closeOnEvent, {
      capture: true,
      passive: true,
    });
  });

  onCleanup(() => {
    document.removeEventListener("resize", computeRect);
    document.removeEventListener("scroll", computeRect);

    document.removeEventListener("keydown", closeOnEscape);
    document.removeEventListener("pointerdown", closeOnEvent);
    document.removeEventListener("focus", closeOnEvent, { capture: true });
  });

  const computeRect = () => {
    if (isServer) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const triggerDomRect = trigger.getBoundingClientRect();

    const triggerRect = {
      y: triggerDomRect.y + window.scrollY,
      x: triggerDomRect.x + window.scrollX,
      width: triggerDomRect.width,
      height: triggerDomRect.height,
    };

    const marginProportion = 10 / 100;
    const windowWidthMargin = windowWidth * marginProportion;
    const windowHeightMargin = windowHeight * marginProportion;

    const triggerWindowHeightProportion = triggerRect.y / windowHeight;

    const align: RectAlign =
      triggerWindowHeightProportion < 0.5 ? "bottom" : "top";

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

  const closeOnEscape = (event: KeyboardEvent) => {
    if (!open()) return;

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const closeOnEvent = (event: Event) => {
    if (!open()) return;

    const target = event.target as Node | null;

    if (
      target === null ||
      (!trigger.contains(target) && !content.contains(target))
    ) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={trigger}
        onClick={() => {
          if (open()) return;

          computeRect();

          setOpen(true);
        }}
        class={`${props.triggerClass !== undefined ? props.triggerClass : ""} rounded-full p-1 transition-colors`}
      >
        {props.trigger}
      </button>

      <Show when={open()}>
        <Show when={rect()}>
          {(rect) => (
            <Portal>
              <Switch>
                <Match when={rect().align === "top"}>
                  <div
                    class="text-border absolute"
                    style={{
                      left: `${(rect().anchor.x - 16 / 2).toString()}px`,
                      top: `${(rect().anchor.y - 8 - 1).toString()}px`,
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
                      left: `${(rect().anchor.x - 16 / 2).toString()}px`,
                      top: `${(rect().anchor.y + 1).toString()}px`,
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
                class="pointer-events-none absolute flex"
                style={{
                  left: `${rect().content.x.toString()}px`,
                  top: `${(rect().content.y + (rect().align === "top" ? 0 : 8 + 1)).toString()}px`,
                  width: `${rect().content.width.toString()}px`,
                  height: `${(rect().content.height - (rect().align === "top" ? 8 + 1 : 8 + 1)).toString()}px`,
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
                  class="bg-background ring-border pointer-events-auto rounded-lg p-2 shadow-lg ring"
                  tabIndex={-1}
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
}
