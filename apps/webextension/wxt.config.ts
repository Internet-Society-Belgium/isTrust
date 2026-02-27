import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  // debug: true,
  srcDir: "src",
  outDir: "dist",
  imports: false,
  modules: ["@wxt-dev/module-solid", "@wxt-dev/auto-icons"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  targetBrowsers: ["chrome", "firefox", "edge", "safari-macos", "safari-ios"],
  manifest: ({ browser }) => ({
    name: "isTrust",
    default_locale: "en",
    description: "__MSG_description__",
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions
    permissions:
      browser === "safari-ios"
        ? ["activeTab"]
        : browser === "safari-macos"
          ? ["activeTab", "contextMenus"]
          : ["activeTab", "contextMenus", "history"],
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#host_permissions
    // prevent CORS errors
    host_permissions: ["http://*/*", "https://*/*"],
    browser_specific_settings:
      browser === "firefox"
        ? {
            gecko: {
              id: "{431b3adb-f3bf-46e8-8542-151be2dc00c4}",
              data_collection_permissions: {
                required: ["none"],
              },
            },
          }
        : {},
  }),
  zip: {
    artifactTemplate: "isTrust-{{name}}-{{browser}}-{{version}}.zip",
    zipSources: false,
  },
  webExt: {
    startUrls: ["wikipedia.org"],
    openDevtools: true,
    // chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
    binaries: {
      edge: "/opt/microsoft/msedge/msedge",
    },
  },
});
