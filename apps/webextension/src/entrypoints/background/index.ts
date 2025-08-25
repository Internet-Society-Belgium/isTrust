import { messenger } from "@/utils/messaging";
import * as common from "@istrust/common";
import { browser, defineBackground } from "#imports";
import { cache } from "./cache";
import * as history from "./history";

export default defineBackground({
  persistent: false,
  main() {
    onInstalled();

    if (import.meta.env.BROWSER !== "firefox-android") {
      contextMenus();
    }

    onMessage();
  },
});

function onInstalled() {
  browser.runtime.onInstalled.addListener(() => {
    common.update_cache(cache).catch(console.error);
  });
}

function contextMenus() {
  browser.contextMenus.create({
    id: "istrust",
    title: "isTrust",
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType
    contexts: ["link", "selection", "frame"],
  });

  browser.contextMenus.onClicked.addListener((info) => {
    let query =
      info.linkUrl !== undefined
        ? info.linkUrl
        : info.selectionText !== undefined
          ? info.selectionText
          : info.frameUrl;
    if (query === undefined) return;

    query = query.trim();
    if (query === "") return;

    browser.windows
      .create({
        url: `${browser.runtime.getURL("/popup.html")}?q=${query}`,
        type: "popup",
        focused: true,
      })
      .catch(console.error);
  });
}

function onMessage() {
  messenger.onMessage("get_effective_domain", async ({ data: { query } }) => {
    return await common.get_effective_domain(query, cache);
  });

  messenger.onMessage("get_whois_data", async ({ data: { domain } }) => {
    return await common.get_whois_data(domain, cache);
  });

  messenger.onMessage("get_dnssec_data", async ({ data: { domain } }) => {
    return await common.get_dnssec_data(domain, true);
  });

  messenger.onMessage("get_history_data", async ({ data: { domain } }) => {
    return await history.get_history_data(domain);
  });

  messenger.onMessage("get_certificate_data", async ({ data: { domain } }) => {
    return await common.get_certificate_data(domain);
  });

  messenger.onMessage("get_blacklist_data", async ({ data: { domain } }) => {
    return await common.get_blacklist_data(domain, true);
  });
}
