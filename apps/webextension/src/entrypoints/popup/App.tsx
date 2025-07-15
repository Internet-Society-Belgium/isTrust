import { sendMessage } from "@/utils/messaging";
import { DateDifference } from "@istrust/ui/date-difference";
import { get_active_tab } from "@/utils/tab";
import {
  Show,
  createResource,
  createSignal,
  onMount,
  Switch,
  Match,
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

  const force_update_cache = async () => {
    return await sendMessage("force_update_cache");
  };

  return (
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
        <h2>Number of days with known visits:</h2>
        <Switch>
          <Match when={historyData.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={historyData.error}>
            <span>{historyData.error.message}</span>
          </Match>
          <Match when={historyData()?.daysWithVisit}>
            {(daysWithVisit) => <p>{daysWithVisit()}</p>}
          </Match>
          <Match when={true}>
            <p>No previous history</p>
          </Match>
        </Switch>
      </div>

      <div class="flex gap-2">
        <h2>First known visit:</h2>
        <Switch>
          <Match when={historyData.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={historyData.error}>
            <span>{historyData.error.message}</span>
          </Match>
          <Match when={historyData()?.firstVisit}>
            {(firstVisit) => (
              <p>
                <DateDifference
                  date={firstVisit()}
                  locale={navigator.language}
                />
              </p>
            )}
          </Match>
          <Match when={true}>
            <p>No previous history</p>
          </Match>
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
                <DateDifference
                  date={registration()}
                  locale={navigator.language}
                />
              </p>
            )}
          </Match>
        </Switch>
      </div>

      <div class="flex gap-2">
        <h2>Expiration:</h2>
        <Switch>
          <Match when={whoisData.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whoisData.error}>
            <span>{whoisData.error.message}</span>
          </Match>
          <Match when={whoisData()?.expiration}>
            {(expiration) => (
              <p>
                <DateDifference
                  date={expiration()}
                  locale={navigator.language}
                />
              </p>
            )}
          </Match>
        </Switch>
      </div>

      <div class="flex gap-2">
        <h2>Registrant individual:</h2>
        <Switch>
          <Match when={whoisData.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whoisData.error}>
            <span>{whoisData.error.message}</span>
          </Match>
          <Match when={whoisData()?.registrant?.individual}>
            {(individual) => <p>{individual()}</p>}
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
                <Match when={country().code}>{(code) => <p>{code()}</p>}</Match>
                <Match when={country().name}>{(name) => <p>{name()}</p>}</Match>
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

      <button onClick={force_update_cache}>Force update cache</button>
    </div>
  );
}

export default App;
