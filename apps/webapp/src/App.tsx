import { Ago } from "@istrust/ui/ago";
import * as common from "@istrust/common";
import {
  createResource,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
  type Component,
} from "solid-js";

const cache: common.InternalCache = {
  psl: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`psl:${key}`, value),
    get: async (key: string) => localStorage.getItem(`psl:${key}`),
    clear: async () => {
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
    clear: async () => {
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
  const [query, setQuery] = createSignal<string>();

  const [domain] = createResource(query, async (query) => {
    if (query === undefined) return;
    return await common.get_domain(query, cache);
  });

  const [whoisData] = createResource(domain, async (domain) => {
    if (domain === undefined) return;
    return await common.get_whois_data(domain, cache);
  });

  const [dnssecValid] = createResource(domain, async (domain) => {
    if (domain === undefined) return;
    return await common.is_dnssec_valid(domain);
  });

  const [persisted, sepPersisted] = createSignal<boolean>(false);
  onMount(async () => {
    sepPersisted(await navigator.storage.persisted());
  });

  const force_update_cache = async () => {
    await common.force_update_cache(cache);
  };

  return (
    <div class="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const formUrl = formData.get("url");
          if (formUrl === null) return;

          setQuery(formUrl.toString());
        }}
      >
        <input type="text" name="url" required class="p-4 pt-2" />
        <button type="submit">Analyze</button>
      </form>

      <div class="flex w-100 flex-col">
        <div class="flex gap-2">
          <h2>Domain:</h2>
          <Switch>
            <Match when={domain.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={domain.error}>
              <span>{domain.error.message}</span>
            </Match>
            <Match when={domain()}>{(domain) => <p>{domain()}</p>}</Match>
          </Switch>
        </div>

        <div class="flex gap-2">
          <h2>Registration:</h2>
          <Switch>
            <Match when={whoisData.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={whoisData.error}>
              <span>{whoisData.error.message}</span>
            </Match>
            <Match when={whoisData()?.registration}>
              {(registration) => (
                <p>
                  <Ago date={registration()} locale={navigator.language} />
                </p>
              )}
            </Match>
          </Switch>
        </div>

        <div class="flex gap-2">
          <h2>Registrant organization:</h2>
          <Switch>
            <Match when={whoisData.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={whoisData.error}>
              <span>{whoisData.error.message}</span>
            </Match>
            <Match when={whoisData()?.registrant?.organization}>
              {(organization) => <p>{organization()}</p>}
            </Match>
          </Switch>
        </div>

        <div class="flex gap-2">
          <h2>Registrant country:</h2>
          <Switch>
            <Match when={whoisData.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={whoisData.error}>
              <span>{whoisData.error.message}</span>
            </Match>
            <Match when={whoisData()?.registrant?.country}>
              {(country) => (
                <Switch>
                  <Match when={country().code}>
                    {(code) => <p>{code()}</p>}
                  </Match>
                  <Match when={country().name}>
                    {(name) => <p>{name()}</p>}
                  </Match>
                </Switch>
              )}
            </Match>
          </Switch>
        </div>

        <div class="flex gap-2">
          <h2>DNSSEC present:</h2>
          <Switch>
            <Match when={whoisData.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={whoisData.error}>
              <span>{whoisData.error.message}</span>
            </Match>
            <Match when={whoisData()?.dnssecPresent === true}>
              <p>yes</p>
            </Match>
            <Match when={whoisData()?.dnssecPresent === false}>
              <p>no</p>
            </Match>
          </Switch>
        </div>

        <div class="flex gap-2">
          <h2>DNSSEC valid:</h2>
          <Switch>
            <Match when={dnssecValid.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={dnssecValid.error}>
              <span>{dnssecValid.error.message}</span>
            </Match>
            <Match when={dnssecValid() === true}>
              <p>yes</p>
            </Match>
            <Match when={dnssecValid() === false}>
              <p>no</p>
            </Match>
          </Switch>
        </div>

        <details>
          <summary>WHOIS raw data</summary>
          <Show when={whoisData()}>
            {(data) => (
              <pre class="overflow-scroll">
                {JSON.stringify(data(), undefined, 2)}
              </pre>
            )}
          </Show>
        </details>
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

      <button onClick={force_update_cache}>Force update cache</button>
    </div>
  );
};

export default App;
