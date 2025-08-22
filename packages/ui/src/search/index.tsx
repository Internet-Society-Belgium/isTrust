import i18n from "@istrust/i18n";
import { createSignal, onMount } from "solid-js";
import { IconIsTrust, IconNext, IconPrevious, IconReload } from "../icon";

export function SearchBar(props: {
  lang: string;
  initValue?: string;
  reload: () => void;
  // eslint-disable-next-line no-unused-vars
  search: (text: string) => void;
}) {
  const [historyIndex, setHistoryIndex] = createSignal<number>(0);
  const [history, setHistory] = createSignal<string[]>([]);

  let input!: HTMLInputElement;

  onMount(() => {
    input.focus({
      preventScroll: true,
    });

    if (props.initValue !== undefined) {
      input.value = props.initValue;
      search(props.initValue);
    }
  });

  const search = (text: string) => {
    const newHistory = [...history(), text];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    props.search(text);
  };

  const searchFromHistoryIndex = (offset: number) => {
    const newHistoryIndex = Math.max(
      0,
      Math.min(historyIndex() + offset, history().length),
    );

    setHistoryIndex(newHistoryIndex);

    const historyItem = history().at(newHistoryIndex);
    if (historyItem === undefined) return;

    input.value = historyItem;
    props.search(historyItem);
  };

  return (
    <div class="bg-container ring-border flex items-center gap-1 rounded-md p-1.5 ring-1">
      <button
        title={i18n("Previous", props.lang)}
        class="enabled:hover:bg-container-darker disabled:text-muted flex-none rounded p-1.5 transition-colors disabled:pointer-events-none"
        disabled={historyIndex() <= 0}
        onClick={() => {
          searchFromHistoryIndex(-1);
        }}
      >
        <IconPrevious />
      </button>
      <button
        title={i18n("Next", props.lang)}
        class="enabled:hover:bg-container-darker disabled:text-muted flex-none rounded p-1.5 transition-colors disabled:pointer-events-none"
        disabled={historyIndex() >= history().length - 1}
        onClick={() => {
          searchFromHistoryIndex(1);
        }}
      >
        <IconNext />
      </button>
      <button
        title={i18n("Reload", props.lang)}
        class="enabled:hover:bg-container-darker disabled:text-muted flex-none rounded p-1.5 transition-colors disabled:pointer-events-none"
        disabled={history().length <= 0}
        onClick={() => {
          props.reload();
        }}
      >
        <IconReload />
      </button>
      <form
        class="flex flex-1 gap-1 pl-1.5"
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const q = formData.get("q") as string | null;
          if (q !== null) {
            search(q);
          }
        }}
      >
        <input
          ref={input}
          type="q"
          name="q"
          required
          spellcheck={false}
          class="bg-container-darker placeholder:text-dimmed w-full flex-1 rounded-md border-0 px-2.5 py-1 text-sm"
          placeholder="https://istrust.org/"
        />
        <button
          title={i18n("Submit", props.lang)}
          type="submit"
          class="hover:bg-container-darker flex-none rounded p-1.5 transition-colors"
        >
          <IconIsTrust />
        </button>
      </form>
    </div>
  );
}
