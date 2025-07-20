import { DateDifference } from "@istrust/ui/date";
import { Country } from "@istrust/ui/country";
import { List } from "@istrust/ui/list";
import * as common from "@istrust/common";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type Component,
} from "solid-js";

const cache: common.DataCache = {
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
    return await common.get_effective_domain(query, cache);
  });

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_whois_data(domain, cache);
    },
  );

  const [dnssecValid] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.is_dnssec_valid(domain);
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_certificate_data(domain);
    },
  );

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

      <ErrorBoundary fallback={(error) => <p>{error.message}</p>}>
        <div class="flex w-150 flex-col">
          <div class="flex gap-2">
            <h2>Domain:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={domain()}>{(domain) => <p>{domain()}</p>}</Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Registration:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.registration}>
                {(registrations) => (
                  <List each={registrations()}>
                    {(registration) => (
                      <p>
                        <DateDifference
                          date={registration.value}
                          locale={navigator.language}
                        />
                      </p>
                    )}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Expiration:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.expiration}>
                {(expirations) => (
                  <List each={expirations()}>
                    {(expiration) => (
                      <p>
                        <DateDifference
                          date={expiration.value}
                          locale={navigator.language}
                        />
                      </p>
                    )}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Individual:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show
                when={[
                  ...(certificateData()?.individuals || []),
                  ...(whoisData()?.individuals || []),
                ]}
              >
                {(data) => (
                  <List each={data()}>
                    {(individual) => <p>{individual.value}</p>}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Organization:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show
                when={[
                  ...(certificateData()?.organizations || []),
                  ...(whoisData()?.organizations || []),
                ]}
              >
                {(data) => (
                  <List each={data()}>
                    {(organization) => <p>{organization.value}</p>}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Country:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show
                when={[
                  ...(certificateData()?.countries || []),
                  ...(whoisData()?.countries || []),
                ]}
              >
                {(data) => (
                  <List each={data()}>
                    {(country) => (
                      <p>
                        <Country
                          value={country.value}
                          locale={navigator.language}
                        />
                      </p>
                    )}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>DNSSEC:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Switch>
                <Match when={dnssecValid() === true}>valid</Match>
                <Match
                  when={whoisData()?.dnssecPresent?.find(
                    (v) => v.value === true,
                  )}
                >
                  {(dnssecPresent) => (
                    <>{`present (${dnssecPresent().verification.status})`}</>
                  )}
                </Match>
                <Match when={true}>no</Match>
              </Switch>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate type:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.type}>
                {(types) => (
                  <List each={types()}>
                    {(type) => (
                      <Switch>
                        <Match when={type.value === "DV"}>
                          Domain validated
                        </Match>
                        <Match when={type.value === "IV"}>
                          Individual validated
                        </Match>
                        <Match when={type.value === "OV"}>
                          Organization validated
                        </Match>
                        <Match when={type.value === "EV"}>
                          Extended validation
                        </Match>
                      </Switch>
                    )}
                  </List>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate business category:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.businessCategories}>
                {(businessCategory) => (
                  <List each={businessCategory()}>
                    {(businessCategory) => <p>{businessCategory.value}</p>}
                  </List>
                )}
              </Show>
            </Suspense>
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

          <details>
            <summary>certificate raw data</summary>
            <Show when={certificateData()}>
              {(data) => (
                <pre class="overflow-scroll">
                  {JSON.stringify(data(), undefined, 2)}
                </pre>
              )}
            </Show>
          </details>
        </div>
      </ErrorBoundary>

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
