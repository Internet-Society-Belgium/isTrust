import { createSignal, JSX, onCleanup, onMount, Show } from "solid-js";
import { isServer, Portal } from "solid-js/web";

export function Popover(props: {
  trigger: JSX.Element;
  triggerClass?: string;
  children: JSX.Element;
}) {
  const [open, setOpen] = createSignal<boolean>(false);

  // eslint-disable-next-line no-unassigned-vars
  let trigger!: HTMLButtonElement;
  // eslint-disable-next-line no-unassigned-vars
  let container!: HTMLDivElement;
  // eslint-disable-next-line no-unassigned-vars
  let anchor!: HTMLDivElement;
  // eslint-disable-next-line no-unassigned-vars
  let content!: HTMLDivElement;

  onMount(() => {
    document.addEventListener("resize", resize, { passive: true });
    document.addEventListener("scroll", resize, { passive: true });

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
    document.removeEventListener("resize", resize);
    document.removeEventListener("scroll", resize);

    document.removeEventListener("keydown", closeOnEscape);
    document.removeEventListener("pointerdown", closeOnEvent);
    document.removeEventListener("focus", closeOnEvent, { capture: true });
  });

  const resize = () => {
    if (isServer) return;

    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      container === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      anchor === undefined ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      content === undefined
    ) {
      return;
    }

    const windowVisibleWidth = window.innerWidth;
    const windowVisibleHeight = window.innerHeight;

    const triggerVisibleRect = trigger.getBoundingClientRect();

    const triggerRect = {
      y: triggerVisibleRect.y + window.scrollY,
      x: triggerVisibleRect.x + window.scrollX,
      width: triggerVisibleRect.width,
      height: triggerVisibleRect.height,
    };

    const windowMargin = 20;

    const triggerVisibleHeightProportion =
      triggerVisibleRect.y / windowVisibleHeight;

    const align = triggerVisibleHeightProportion < 0.5 ? "bottom" : "top";

    const arrowMargin = 10;

    const safeX = Math.min(triggerRect.x - arrowMargin, windowMargin);
    const safeY =
      align === "top" ? windowMargin : triggerRect.y + triggerRect.height;
    const safeWidth =
      windowVisibleWidth -
      safeX -
      Math.min(
        windowVisibleWidth - (triggerRect.x + triggerRect.width + arrowMargin),
        windowMargin,
      );
    const safeHeight =
      align === "top"
        ? triggerRect.y - safeY
        : windowVisibleHeight - windowMargin - safeY;

    const anchorWidth = 16;
    const anchorX = triggerRect.x + triggerRect.width / 2 - anchorWidth / 2;

    anchor.style.transform = `rotate(${align === "top" ? "0" : "180"}deg)`;
    anchor.style.left = `${anchorX.toString()}px`;
    anchor.style.top = `${(align === "top" ? triggerRect.y - 8 - 1 : triggerRect.y + triggerRect.height + 1).toString()}px`;

    container.style.left = `${safeX.toString()}px`;
    container.style.top = `${(safeY + (align === "top" ? 0 : 8 + 1)).toString()}px`;
    container.style.width = `${safeWidth.toString()}px`;
    container.style.height = `${(safeHeight - (8 + 1)).toString()}px`;
    container.style.alignItems = align === "top" ? "flex-end" : "flex-start";

    const contentVisibleRect = content.getBoundingClientRect();

    const diffAnchorContentLeft = anchorX - contentVisibleRect.x;
    const diffAnchorContentRight = -(
      contentVisibleRect.x +
      contentVisibleRect.width -
      (anchorX + anchorWidth)
    );

    if (diffAnchorContentLeft < 0) {
      content.style.transform = `translate(${(diffAnchorContentLeft - arrowMargin).toString()}px, 0px)`;
    } else if (diffAnchorContentRight > 0) {
      content.style.transform = `translate(${(diffAnchorContentRight + arrowMargin).toString()}px, 0px)`;
    }

    container.style.opacity = "1";
    anchor.style.opacity = "1";

    content.style.pointerEvents = "auto";
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
          if (open()) {
            setOpen(false);
          } else {
            setOpen(true);

            resize();
          }
        }}
        class={`${props.triggerClass !== undefined ? props.triggerClass : ""} rounded-full p-1 transition-colors`}
      >
        {props.trigger}
      </button>

      <Show when={open()}>
        <Portal>
          <div
            ref={anchor}
            class="absolute shadow-lg transition"
            style={{ opacity: "0", "z-index": 11 }}
          >
            <svg width="16px" height="8px" viewBox="0 0 255 127.5">
              <path
                d="M 0,0 L 127.5,127.5 L 255,0"
                fill="#f8fafc" // var(--color-background)
                stroke="#e2e8f0" // var(--color-border)
                stroke-width="20"
              />
            </svg>
          </div>

          <div
            ref={container}
            class="pointer-events-none absolute flex justify-center transition"
            style={{ opacity: "0", "z-index": 10 }}
          >
            <div
              ref={content}
              class="bg-background ring-border rounded-lg p-2 shadow-lg ring"
              tabIndex={-1}
            >
              {props.children}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
}
