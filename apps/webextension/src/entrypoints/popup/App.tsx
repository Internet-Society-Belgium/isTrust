import { sendMessage } from "@/utils/messaging";
import { Ago } from "@istrust/ui/ago";
import { getActiveTab } from "@/utils/tab";
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

  const [domain] = createResource(query, async (query) => {
    if (query === undefined) return;
    return await sendMessage("get_domain", {
      query,
    });
  });

  const [whois] = createResource(domain, async (domain) => {
    if (domain === undefined) return;

    return await sendMessage("whois", {
      domain,
    });
  });

  onMount(async () => {
    const params = new URLSearchParams(document.location.search);

    const paramUrl = params.get("q");
    if (paramUrl !== null) {
      setQuery(paramUrl);
    } else {
      const tab = await getActiveTab();
      if (tab.url) {
        setQuery(tab.url);
      }
    }
  });

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
        <h2>Registration:</h2>
        <Switch>
          <Match when={whois.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whois.error}>
            <span>{whois.error.message}</span>
          </Match>
          <Match when={whois()?.registration}>
            {(registration) => (
              <p>
                <Ago date={registration()} />
              </p>
            )}
          </Match>
        </Switch>
      </div>

      <div class="flex gap-2">
        <h2>Registrant organization:</h2>
        <Switch>
          <Match when={whois.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whois.error}>
            <span>{whois.error.message}</span>
          </Match>
          <Match when={whois()?.registrant?.organization}>
            {(organization) => <p>{organization()}</p>}
          </Match>
        </Switch>
      </div>

      <div class="flex gap-2">
        <h2>Registrant country:</h2>
        <Switch>
          <Match when={whois.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whois.error}>
            <span>{whois.error.message}</span>
          </Match>
          <Match when={whois()?.registrant?.country}>
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
          <Match when={whois.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whois.error}>
            <span>{whois.error.message}</span>
          </Match>
          <Match when={whois()?.dnssecPresent === true}>
            <p>yes</p>
          </Match>
          <Match when={whois()?.dnssecPresent === false}>
            <p>no</p>
          </Match>
        </Switch>
      </div>

      <details>
        <summary>WHOIS raw data</summary>
        <Show when={whois()}>
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
