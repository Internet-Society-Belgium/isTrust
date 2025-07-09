import { sendMessage } from "@/utils/messaging";
import { extractDomain } from "@/utils/url";
import { Ago } from "@istrust/ui/ago";
import { getActiveTab } from "@/utils/tab";
import {
  Show,
  ErrorBoundary,
  Suspense,
  createResource,
  createSignal,
  onMount,
} from "solid-js";

function App() {
  const [url, setUrl] = createSignal<string>();

  const [historyErrorReset, setHistoryErrorReset] = createSignal<() => void>();
  // eslint-disable-next-line solid/reactivity
  const [history] = createResource(url, async (url) => {
    const reset = historyErrorReset();
    if (reset) reset();

    const domain = extractDomain(url);

    return await sendMessage("history", {
      domain,
    });
  });

  onMount(async () => {
    const params = new URLSearchParams(document.location.search);

    const paramUrl = params.get("url");
    if (paramUrl !== null) {
      setUrl(paramUrl);
    } else {
      const tab = await getActiveTab();
      if (tab.url) {
        setUrl(tab.url);
      }
    }
  });

  return (
    <div>
      <Show when={url()}>
        {(url) => (
          <>
            <p>{extractDomain(url())}</p>

            <ErrorBoundary
              fallback={(err: Error, reset) => {
                setHistoryErrorReset(() => reset);
                return <span>Error: {err.message}</span>;
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <Show when={history()}>
                  {(history) => (
                    <>
                      {/* <pre class="w-80 overflow-scroll">
                  {JSON.stringify(history(), undefined, 2)}
                </pre> */}

                      <div>Number of known visits: {history().data.visits}</div>

                      <Show when={history().data.firstVisit}>
                        {(firstVisit) => (
                          <>
                            First known visit: <Ago timestamp={firstVisit()} />
                          </>
                        )}
                      </Show>
                    </>
                  )}
                </Show>
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </Show>
    </div>
  );
}

export default App;
