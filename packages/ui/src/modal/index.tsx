import { JSX, onCleanup, onMount, type Component } from "solid-js";
import { Portal } from "solid-js/web";
import "../styles.css";

interface Props {
  title: string;
  children: JSX.Element;
  onClose: () => void;
}

export const Modal: Component<Props> = (props) => {
  let content!: HTMLDivElement;

  onMount(() => {
    document.addEventListener("keydown", closeOnEscape, { passive: true });
    document.addEventListener("pointerdown", closeOnEvent, {
      passive: true,
    });
    document.addEventListener("focus", closeOnEvent, {
      capture: true,
      passive: true,
    });
    document.addEventListener("blur", closeOnEvent, {
      capture: true,
      passive: true,
    });
  });

  onCleanup(() => {
    document.removeEventListener("keydown", closeOnEscape);
    document.removeEventListener("pointerdown", closeOnEvent);
    document.removeEventListener("focus", closeOnEvent, { capture: true });
    document.removeEventListener("blur", closeOnEvent, { capture: true });
  });

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      props.onClose();
    }
  };

  const closeOnEvent = (event: Event) => {
    const target = event.target as Node;

    if (target === null || !content.contains(target)) {
      props.onClose();
    }
  };

  return (
    <Portal>
      <div class="pointer-events-none fixed inset-0 flex items-center justify-center bg-gray-500/75 transition-opacity">
        <div
          ref={content}
          class="bg-background ring-border divide-border pointer-events-auto divide-y rounded-lg shadow-lg ring"
          tabIndex={0}
        >
          <div class="flex items-center justify-between p-2">
            <h3>{props.title}</h3>

            <button
              onClick={() => {
                props.onClose();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="m15 9l-6 6m0-6l6 6" />
                </g>
              </svg>
            </button>
          </div>

          <div class="p-2">
            <p>{props.children}</p>
          </div>
        </div>
      </div>
    </Portal>
  );
};
