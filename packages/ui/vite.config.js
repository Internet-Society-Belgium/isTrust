import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  build: {
    lib: {
      entry: {
        date: "src/date/index.tsx",
        country: "src/country/index.tsx",
      },
      formats: ["es"],
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web"],
    },
  },
  plugins: [solid(), tailwindcss(), dts({ rollupTypes: true })],
});
