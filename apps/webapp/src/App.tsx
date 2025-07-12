import { Ago } from "@istrust/ui/ago";
import * as common from "@istrust/common";
import {
  createResource,
  createSignal,
  onMount,
  Show,
  type Component,
} from "solid-js";

const cache: common.InternalCache = {
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
  rdap: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`rdap:${key}`, value),
    get: async (key: string) => localStorage.getItem(`rdap:${key}`),
    flush: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("rdap:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
};

const App: Component = () => {
  const [domain, setDomain] = createSignal<string>();

  const [persisted, sepPersisted] = createSignal<boolean>(false);
  onMount(async () => {
    sepPersisted(await navigator.storage.persisted());
  });

  const [whoisData] = createResource(domain, async (domain: string) => {
    if (domain === undefined) return;
    return await common.whois(domain, cache);
  });

  const force_reload_cache = async () => {
    await common.force_reload(cache);
  };

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
            .match(/^(https?:\/\/)?(.*)/)
            ?.at(2);

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
          <Show when={whoisData()}>
            {(data) => (
              <>
                <Show when={data().registration}>
                  {(registration) => (
                    <p>
                      Registered <Ago timestamp={registration().getTime()} />
                    </p>
                  )}
                </Show>

                <details>
                  <summary>raw data</summary>
                  <pre class="overflow-scroll">
                    {JSON.stringify(whoisData(), undefined, 2)}
                  </pre>
                </details>
              </>
            )}
          </Show>
        </div>
      </div>

      {persisted() ? (
        <div>Persisted</div>
      ) : (
        <button
          onClick={async () => {
            await navigator.storage.persist();
            sepPersisted(await navigator.storage.persisted());
          }}
        >
          Persist
        </button>
      )}

      <button onClick={force_reload_cache}>Force reload cache</button>
    </div>
  );
};

export default App;
