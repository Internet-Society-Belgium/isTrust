import { Ago } from "@istrust/ui/ago";
import { InternalCache, whois } from "@istrust/common";
import { createResource, createSignal, Show, type Component } from "solid-js";

const cache: InternalCache = {
  psl: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`psl:${key}`, value),
    get: async (key: string) => localStorage.getItem(`psl:${key}`),
    flush: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("psl:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
};

const App: Component = () => {
  const [url, setURL] = createSignal<URL>();

  const [whoisData] = createResource(url, async (url: URL) => {
    if (url === undefined) return;
    const domain = url.hostname;
    return await whois(domain, cache);
  });

  return (
    <div class="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const url_form = formData.get("url");

          if (url_form !== null) {
            const url = new URL(url_form.toString());
            setURL(url);
          }
        }}
      >
        <input type="text" name="url" required class="p-4 pt-2" />
        <button type="submit">Analyze</button>
      </form>

      <div class="flex w-100 flex-col">
        <div>
          URL: <Show when={url()}>{(url) => <>{url().toString()}</>}</Show>
        </div>

        <div>
          Last visit: <Ago timestamp={new Date().getTime()} />
        </div>

        <div>
          WHOIS:{" "}
          <pre class="overflow-scroll">
            {JSON.stringify(whoisData(), undefined, 2)}
          </pre>
        </div>
      </div>

      <Show when={navigator.storage && navigator.storage.persist}>
        <button
          onClick={async () => {
            await navigator.storage.persist();
          }}
        >
          Persist
        </button>
      </Show>
    </div>
  );
};

export default App;
