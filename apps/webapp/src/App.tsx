import { Ago } from "@istrust/ui/ago";
import { whois } from "@istrust/common";
import { createResource, createSignal, Show, type Component } from "solid-js";

const App: Component = () => {
  const [url, setURL] = createSignal<URL>();

  const [whoisData] = createResource(url, async (url: URL) => {
    if (url === undefined) return;
    const domain = url.hostname;
    return await whois(domain);
  });

  return (
    <div class="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const url_form = formData.get("url");

          if (url_form !== null) {
            const url = new URL(url_form.toString());
            setURL(url);
          }
        }}
      >
        <input type="text" name="url" required class="p-4 pt-2" />
        <button type="submit">Analyze</button>
      </form>

      <div class="flex w-100 flex-col">
        <div>
          URL: <Show when={url()}>{(url) => <>{url().toString()}</>}</Show>
        </div>

        <div>
          Last visit: <Ago timestamp={new Date().getTime()} />
        </div>

        <div>
          WHOIS:{" "}
          <pre class="overflow-scroll">
            {JSON.stringify(whoisData(), undefined, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
