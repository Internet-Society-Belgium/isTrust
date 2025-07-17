import { sendMessage } from "@/utils/messaging";
import { DateDifference } from "@istrust/ui/date-difference";
import { Country } from "@istrust/ui/country";
import { get_active_tab } from "@/utils/tab";
import {
  Show,
  createResource,
  createSignal,
  onMount,
  ErrorBoundary,
  Suspense,
} from "solid-js";

function App() {
  const [query, setQuery] = createSignal<string>();

  onMount(async () => {
    const params = new URLSearchParams(document.location.search);

    const paramUrl = params.get("q");
    if (paramUrl !== null) {
      setQuery(paramUrl);
    } else {
      const tab = await get_active_tab();
      if (tab.url) {
        setQuery(tab.url);
      }
    }
  });

  const [domain] = createResource(query, async (query) => {
    return await sendMessage("get_effective_domain", {
      query,
    });
  });

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await sendMessage("get_history_data", {
        domain,
      });
    },
  );

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await sendMessage("get_whois_data", {
        domain,
      });
    },
  );

  const [dnssecValid] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await sendMessage("is_dnssec_valid", {
        domain,
      });
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await sendMessage("get_certificate_data", {
        domain,
      });
    },
  );

  const force_update_cache = async () => {
    return await sendMessage("force_update_cache");
  };

  return (
    <div class="flex w-100 flex-col">
      <ErrorBoundary fallback={(error) => <p>{error.message}</p>}>
        <div class="flex w-100 flex-col">
          <div class="flex gap-2">
            <h2>Domain:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={domain()}>{(domain) => <p>{domain()}</p>}</Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Number of days with known visits:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={historyData()?.daysWithVisit}>
                {(daysWithVisit) => <p>{daysWithVisit()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>First known visit:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={historyData()?.firstVisit}>
                {(firstVisit) => (
                  <p>
                    <DateDifference
                      date={firstVisit()}
                      locale={navigator.language}
                    />
                  </p>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Registration:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.registration}>
                {(registration) => (
                  <p>
                    <DateDifference
                      date={registration()}
                      locale={navigator.language}
                    />
                  </p>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Expiration:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.expiration}>
                {(expiration) => (
                  <p>
                    <DateDifference
                      date={expiration()}
                      locale={navigator.language}
                    />
                  </p>
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Registrant individual:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.registrant?.individual}>
                {(individual) => <p>{individual()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate individual:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.individual}>
                {(individual) => <p>{individual()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Registrant organization:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.registrant?.organization}>
                {(organization) => <p>{organization()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate organization:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.organisation}>
                {(organization) => <p>{organization()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Registrant country:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.registrant?.country}>
                {(country) => (
                  <Country value={country()} locale={navigator.language} />
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate country:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.country}>
                {(country) => (
                  <Country value={country()} locale={navigator.language} />
                )}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>DNSSEC present:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={whoisData()?.dnssecPresent === true}>
                <p>yes</p>
              </Show>
              <Show when={whoisData()?.dnssecPresent === false}>
                <p>no</p>
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>DNSSEC valid:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={dnssecValid() === true}>
                <p>yes</p>
              </Show>
              <Show when={dnssecValid() === false}>
                <p>no</p>
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate type:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.type}>
                {(type) => <p>{type()}</p>}
              </Show>
            </Suspense>
          </div>

          <div class="flex gap-2">
            <h2>Certificate business category:</h2>
            <Suspense fallback={<span>Loading...</span>}>
              <Show when={certificateData()?.businessCategory}>
                {(businessCategory) => <p>{businessCategory()}</p>}
              </Show>
            </Suspense>
          </div>

          <details>
            <summary>history raw data</summary>
            <Show when={historyData()}>
              {(data) => (
                <pre class="overflow-scroll">
                  {JSON.stringify(data(), undefined, 2)}
                </pre>
              )}
            </Show>
          </details>

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

      <button onClick={force_update_cache}>Force update cache</button>
    </div>
  );
}

export default App;
