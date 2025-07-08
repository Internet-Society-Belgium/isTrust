import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  outDir: "dist",
  // debug: true,
  imports: false,
  modules: ["@wxt-dev/module-solid"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  webExt: {
    startUrls: ["wikipedia.org"],
    openDevtools: true,
  },
  manifest: {
    name: "isTrust",
    key: "istrust",
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
    permissions: ["activeTab", "contextMenus", "history"],
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/optional_permissions
    optional_permissions: [],
  },
  zip: {
    zipSources: false,
  },
});
