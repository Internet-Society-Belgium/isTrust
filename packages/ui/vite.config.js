import tailwindcss from "@tailwindcss/vite";
import glob from "glob";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import solid from "vite-plugin-solid";

const files = glob.sync("src/*/index.tsx").map((f) => {
  const m = f.match(/src\/(.*)\/index.tsx/);
  return [m[1], f];
});
const entries = Object.fromEntries(files);

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: entries,
      formats: ["es"],
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web"],
    },
  },
  plugins: [
    solid(),
    tailwindcss(),
    dts({ rollupTypes: mode === "development" ? false : true }),
  ],
}));
