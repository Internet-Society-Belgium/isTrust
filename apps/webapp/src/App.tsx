import { DateDifference } from "@istrust/ui/date";
import { Country } from "@istrust/ui/country";
import { List } from "@istrust/ui/list";
import { Container } from "@istrust/ui/container";
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
import { Modal } from "@istrust/ui/modal";
import { Verification } from "@istrust/ui/verification";

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
    <div class="bg-background flex flex-col items-center">
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
        <div class="flex w-md flex-col">
          <div class="flex items-center justify-center">
            <Switch>
              <Match when={domain.loading}>
                <Modal>
                  <div>
                    <p>Analyzing URL...</p>
                  </div>
                </Modal>
              </Match>
              <Match when={domain.error}>Invalid URL</Match>
              <Match when={domain()}>{(domain) => <h1>{domain()}</h1>}</Match>
            </Switch>
          </div>

          <div class="flex flex-col gap-4">
            <Show
              when={certificateData()?.types?.some(
                (type) => type.value === "EV",
              )}
            >
              <div class="flex gap-2">
                Organization legitimacy has been verified by the certificate
                authority using strict verification
              </div>
            </Show>

            <Container title="Owner">
              <div class="flex gap-2">
                <h3>Individual:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={[
                      ...(certificateData()?.individuals || []),
                      ...(whoisData()?.individuals || []),
                    ]}
                  >
                    {(individuals) => (
                      <List
                        each={individuals()}
                        suffix={(individual) => (
                          <Verification
                            verification={individual.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(individual) => <>{individual.value}</>}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>

              <div class="flex items-center gap-2">
                <h3>Organization:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={[
                      ...(certificateData()?.organizations || []),
                      ...(whoisData()?.organizations || []),
                    ]}
                  >
                    {(organizations) => (
                      <List
                        each={organizations()}
                        suffix={(organization) => (
                          <Verification
                            verification={organization.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(organization) => <>{organization.value}</>}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>

              <div class="flex gap-2">
                <h3>Country:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={[
                      ...(certificateData()?.countries || []),
                      ...(whoisData()?.countries || []),
                    ]}
                  >
                    {(countries) => (
                      <List
                        each={countries()}
                        suffix={(country) => (
                          <Verification
                            verification={country.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(country) => (
                          <Country
                            value={country.value}
                            locale={navigator.language}
                            type="full"
                          />
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>

              <div class="flex gap-2">
                <h3>Business category:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show when={certificateData()?.businessCategories}>
                    {(businessCategories) => (
                      <List
                        each={businessCategories()}
                        suffix={(businessCategory) => (
                          <Verification
                            verification={businessCategory.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(businessCategory) => <>{businessCategory.value}</>}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>
            </Container>

            <Container title="Domain">
              <div class="flex gap-2">
                <h3>Registration:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show when={whoisData()?.registrations}>
                    {(registrations) => (
                      <List
                        each={registrations()}
                        suffix={(registration) => (
                          <Verification
                            verification={registration.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(registration) => (
                          <DateDifference
                            date={registration.value}
                            locale={navigator.language}
                          />
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>

              <div class="flex gap-2">
                <h3>Expiration:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Show when={whoisData()?.expirations}>
                    {(expirations) => (
                      <List
                        each={expirations()}
                        suffix={(expiration) => (
                          <Verification
                            verification={expiration.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(expiration) => (
                          <DateDifference
                            date={expiration.value}
                            locale={navigator.language}
                          />
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </div>

              <div class="flex gap-2">
                <h3>DNSSEC:</h3>
                <Suspense fallback={<span>Loading...</span>}>
                  <Switch>
                    <Match when={dnssecValid() === true}>valid</Match>
                    <Match when={dnssecValid() === false}>no</Match>
                  </Switch>
                </Suspense>
              </div>
            </Container>

            <Container title="Debug">
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
            </Container>
          </div>
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
