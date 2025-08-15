import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  outDir: "dist",
  imports: false,
  modules: ["@wxt-dev/module-solid", "@wxt-dev/auto-icons"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: ({ browser }) => ({
    name: "isTrust",
    description: "Verify the trustworthiness of any domain",
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
    permissions:
      browser === "safari"
        ? ["activeTab", "contextMenus", "storage"]
        : ["activeTab", "contextMenus", "storage", "history"],
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/optional_permissions
    optional_permissions: [],
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#host_permissions
    // prevent CORS errors
    host_permissions: ["https://api.dnsbelgium.be/*", "https://api.sidn.nl/*"],
  }),
  zip: {
    artifactTemplate: "isTrust-{{name}}-{{browser}}-{{version}}.zip",
    zipSources: false,
  },
  // debug: true,
  webExt: {
    startUrls: ["wikipedia.org"],
    openDevtools: true,
    // chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
});
