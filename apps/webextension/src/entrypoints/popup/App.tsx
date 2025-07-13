import { sendMessage } from "@/utils/messaging";
import * as common from "@istrust/common";
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
  const [domain, setDomain] = createSignal<string>();

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
      const d = common.parse_domain(paramUrl);
      setDomain(d);
    } else {
      const tab = await getActiveTab();
      if (tab.url) {
        const d = common.parse_domain(tab.url);
        setDomain(d);
      }
    }
  });

  const force_update_cache = async () => {
    return await sendMessage("force_update_cache");
  };

  return (
    <div>
      <div>
        WHOIS:{" "}
        <Switch>
          <Match when={whois.loading}>
            <span>Loading...</span>
          </Match>
          <Match when={whois.error}>
            <span>{whois.error.message}</span>
          </Match>
          <Match when={whois()}>
            {(data) => (
              <>
                <Show when={data().registration}>
                  {(registration) => (
                    <p>
                      Registered <Ago date={registration()} />
                    </p>
                  )}
                </Show>

                <details>
                  <summary>raw data</summary>
                  <pre class="overflow-scroll">
                    {JSON.stringify(data(), undefined, 2)}
                  </pre>
                </details>
              </>
            )}
          </Match>
        </Switch>
      </div>

      <button onClick={force_update_cache}>Force update cache</button>
    </div>
  );
}

export default App;
