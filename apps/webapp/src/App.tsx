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
  const [domain, setDomain] = createSignal<string>();

  const [whoisData] = createResource(domain, async (domain: string) => {
    if (domain === undefined) return;
    return await whois(domain, cache);
  });

  return (
    <div class="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const formUrl = formData.get("url");
          if (formUrl === null) return;

          const formDomain = formUrl
            .toString()
            .match(/^https?:\/\/(.*)/)
            ?.at(1);

          const url = new URL(`https://${formDomain}`);
          setDomain(url.hostname);
        }}
      >
        <input type="text" name="url" required class="p-4 pt-2" />
        <button type="submit">Analyze</button>
      </form>

      <div class="flex w-100 flex-col">
        <div>
          Domain: <Show when={domain()}>{(domain) => <>{domain()}</>}</Show>
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
