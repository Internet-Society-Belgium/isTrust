import { createSignal, type Component } from "solid-js";
import "../styles.css";

interface Props {
  reload: () => void;
  // eslint-disable-next-line no-unused-vars
  search: (text: string) => void;
}

export const SearchBar: Component<Props> = (props) => {
  const [historyIndex, setHistoryIndex] = createSignal<number>(0);
  const [history, setHistory] = createSignal<string[]>([]);

  let input!: HTMLInputElement;

  const searchFromHistoryIndex = (offset: number) => {
    const newHistoryIndex = historyIndex() + offset;

    setHistoryIndex(newHistoryIndex);

    const historyItem = history().at(newHistoryIndex);
    if (historyItem === undefined) return;

    input.value = historyItem;
    props.search(historyItem);
  };

  return (
    <div class="bg-container ring-border flex items-center gap-1 rounded-md p-1.5 ring-1">
      <button
        class="enabled:hover:bg-container-darker disabled:text-muted flex-none rounded p-1.5 transition-colors disabled:pointer-events-none"
        disabled={historyIndex() <= 0}
        onClick={() => {
          searchFromHistoryIndex(-1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="m12 19l-7-7l7-7m7 7H5"
          />
        </svg>
      </button>
      <button
        class="enabled:hover:bg-container-darker disabled:text-muted flex-none rounded p-1.5 transition-colors disabled:pointer-events-none"
        disabled={historyIndex() >= history().length - 1}
        onClick={() => {
          searchFromHistoryIndex(+1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M5 12h14m-7-7l7 7l-7 7"
          />
        </svg>
      </button>
      <button
        class="hover:bg-container-darker flex-none rounded p-1.5"
        onClick={() => props.reload()}
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
            stroke-width="2.5"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </g>
        </svg>
      </button>
      <form
        class="flex flex-1 gap-1 pl-1.5"
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const text = formData.get("text")?.toString();
          if (text === undefined) return;

          const newHistory = [...history(), text];
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);

          props.search(text);
        }}
      >
        <input
          ref={input}
          type="text"
          name="text"
          required
          class="bg-container-darker placeholder:text-dimmed focus-visible:ring-primary w-full flex-1 rounded-md border-0 px-2.5 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
          placeholder="https://istrust.org/"
        />
        <button
          type="submit"
          class="hover:bg-container-darker flex-none rounded p-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 135.467 135.467"
          >
            <path
              fill="none"
              stroke="#07f"
              stroke-width="21.167"
              d="M24.647 29.997c16.995-18.288 66.205-18.288 86.204 0 7.502 54.08-21.446 71.45-43.102 87.685-21.765-16.236-50.713-33.604-43.102-87.685Z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
