import { DateDifference } from "@istrust/ui/date";
import { Country } from "@istrust/ui/country";
import { List } from "@istrust/ui/list";
import { Section } from "@istrust/ui/section";
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
import { Item } from "@istrust/ui/item";

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

  const [dnssecData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_dnssec_data(domain);
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
    <div class="bg-background flex min-h-screen flex-col items-center">
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
        <div class="flex w-xs flex-col">
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

            <Section title="Owner">
              <Item
                title="Individual"
                prefix={
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </g>
                  </svg>
                }
              >
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={common.get_best_data_array([
                      ...(certificateData()?.individuals || []),
                      ...(whoisData()?.individuals || []),
                    ])}
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
              </Item>

              <Item
                title="Organization"
                prefix={
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
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
                    </g>
                  </svg>
                }
              >
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={common.get_best_data_array([
                      ...(certificateData()?.organizations || []),
                      ...(whoisData()?.organizations || []),
                    ])}
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
              </Item>

              <Item
                title="Country"
                prefix={
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
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </g>
                  </svg>
                }
              >
                <Suspense fallback={<span>Loading...</span>}>
                  <Show
                    when={common.get_best_data_array([
                      ...(certificateData()?.countries || []),
                      ...(whoisData()?.countries || []),
                    ])}
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
                            type="text"
                          />
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </Item>

              <Item
                title="Business category"
                prefix={
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
                      <path d="M12 12h.01M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m14 7a18.15 18.15 0 0 1-20 0" />
                      <rect width="20" height="14" x="2" y="6" rx="2" />
                    </g>
                  </svg>
                }
              >
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
              </Item>
            </Section>

            <Section title="Domain">
              <Item
                title="Registration"
                prefix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
                    {/* <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    >
                      <path d="M8 2v4m8-4v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M3 10h18m-11 6h4m-2-2v4" />
                    </g> */}

                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    >
                      <path d="M11 14h1v4m4-16v4M3 10h18M8 2v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                    </g>
                  </svg>
                }
              >
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
                          <>
                            Registered{" "}
                            <DateDifference
                              date={registration.value}
                              locale={navigator.language}
                            />
                          </>
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </Item>

              <Item
                title="Expiration"
                prefix={
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
                      <path d="M8 2v4m8-4v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M3 10h18m-7 4l-4 4m0-4l4 4" />
                    </g>
                  </svg>
                }
              >
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
                          <>
                            Expire{" "}
                            <DateDifference
                              date={expiration.value}
                              locale={navigator.language}
                            />
                          </>
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </Item>

              <Item
                title="DNSSEC"
                prefix={
                  <Switch>
                    <Match when={dnssecData()?.valid.value === true}>
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
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                          <path d="m9 12l2 2l4-4" />
                        </g>
                      </svg>
                    </Match>
                    <Match when={dnssecData()?.valid.value === false}>
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
                          stroke-width="2"
                          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zm-5.5-3.5l-5 5m0-5l5 5"
                        />
                      </svg>
                    </Match>
                    <Match when={true}>
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
                          stroke-width="2"
                          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                        />
                      </svg>
                    </Match>
                  </Switch>
                }
              >
                <Suspense fallback={<span>Loading...</span>}>
                  <Show when={dnssecData()?.valid}>
                    {(valid) => (
                      <List
                        each={[valid()]}
                        suffix={(valid) => (
                          <Verification
                            verification={valid.verification}
                            locale={navigator.language}
                          />
                        )}
                      >
                        {(valid) => (
                          <Switch>
                            <Match when={valid.value === true}>
                              The domain name is protected
                            </Match>
                            <Match when={valid.value === false}>
                              The domain name is not protected
                            </Match>
                          </Switch>
                        )}
                      </List>
                    )}
                  </Show>
                </Suspense>
              </Item>
            </Section>

            <Section title="Debug">
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
            </Section>
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
