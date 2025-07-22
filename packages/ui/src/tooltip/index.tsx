import {
  createSignal,
  JSX,
  Match,
  onMount,
  Show,
  Switch,
  type Component,
} from "solid-js";
import "../styles.css";

interface Props {
  trigger: JSX.Element;
  children: JSX.Element;
}

export const Tooltip: Component<Props> = (props) => {
  const [open, setOpen] = createSignal<boolean>(false);

  const [rect, setRect] = createSignal<{
    side: "top" | "bottom";
    anchor: { x: number; y: number };
    content: { left: number; top: number; width: number; height: number };
  }>();

  let trigger: HTMLButtonElement | undefined;

  onMount(() => {
    document.addEventListener("resize", () => computeRect());
    document.addEventListener("scroll", () => computeRect());
  });

  const computeRect = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let triggerDomRect = trigger?.getBoundingClientRect();
    if (triggerDomRect === undefined) return;

    const triggerRect = {
      top: triggerDomRect.top + window.scrollY,
      left: triggerDomRect.left + window.scrollX,
      width: triggerDomRect.width,
      height: triggerDomRect.height,
    };

    const marginProportion = 25 / 100;
    const windowWidthMargin = windowWidth * marginProportion;
    const windowHeightMargin = windowHeight * marginProportion;

    let side: "top" | "bottom" = "top";
    if (triggerDomRect.top / windowHeight < 0.5) {
      side = "bottom";
    }

    const contentLeft = Math.min(triggerRect.left, windowWidthMargin);
    const contentTop =
      side === "top"
        ? windowHeightMargin
        : triggerRect.top + triggerRect.height;

    setRect({
      side,
      anchor: {
        x: triggerRect.left + triggerRect.width / 2,
        y:
          side === "top"
            ? triggerRect.top
            : triggerRect.top + triggerRect.height,
      },
      content: {
        left: contentLeft,
        top: contentTop,
        width:
          windowWidth -
          contentLeft -
          Math.min(
            windowWidth - (triggerRect.left + triggerRect.width),
            windowWidthMargin,
          ),
        height:
          side === "top"
            ? triggerRect.top - contentTop
            : windowHeight - windowHeightMargin - contentTop,
      },
    });
  };

  const toggle = async () => {
    computeRect();

    setOpen(!open());
  };

  return (
    <div>
      <button ref={trigger} onClick={() => toggle()}>
        {props.trigger}
      </button>

      <Show when={open() === true}>
        <Show when={rect()}>
          {(rect) => (
            <>
              <Switch>
                <Match when={rect().side === "top"}>
                  <div
                    class="absolute text-gray-500"
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
                <Match when={rect().side === "bottom"}>
                  <div
                    class="absolute text-gray-500"
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
                  left: `${rect().content.left}px`,
                  top: `${rect().content.top + (rect().side === "top" ? 0 : +8 + 1)}px`,
                  width: `${rect().content.width}px`,
                  height: `${rect().content.height + (rect().side === "top" ? -8 - 1 : -8 - 1)}px`,
                  "align-items":
                    rect().side === "top" ? "flex-end" : "flex-start",
                }}
              >
                <div class="overflow-clip rounded bg-gray-500 p-2">
                  {props.children}
                </div>
              </div>
            </>
          )}
        </Show>
      </Show>
    </div>
  );
};
