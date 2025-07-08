import { createSignal, type Component } from "solid-js";

const App: Component = () => {
  const [url, setURL] = createSignal<URL>();

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

      <div class="flex flex-col justify-start">{url()?.toString() || ""}</div>
    </div>
  );
};

export default App;
