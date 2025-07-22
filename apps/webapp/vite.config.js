import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [solidPlugin(), tailwindcss()],
});
