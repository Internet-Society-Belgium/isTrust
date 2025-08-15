import { messenger } from "@/utils/messaging";
import * as common from "@istrust/common";
import { browser, defineBackground } from "#imports";
import { cache } from "./cache";
import * as history from "./history";

export default defineBackground({
  persistent: false,
  main() {
    onInstalled();

    contextMenus();

    onMessage();
  },
});

function onInstalled() {
  browser.runtime.onInstalled.addListener(() => {
    void common.update_cache(cache);
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

    void browser.windows.create({
      url: `${browser.runtime.getURL("/popup.html")}?q=${query}`,
      type: "popup",
      focused: true,
    });
  });
}

function onMessage() {
  messenger.onMessage(
    "get_effective_domain",
    async ({ data: { query: text, forceUpdateCache } }) => {
      if (forceUpdateCache) {
        await common.force_update_cache(cache);
      }

      return await common.get_effective_domain(text, cache);
    },
  );

  messenger.onMessage("get_whois_data", async ({ data: { domain } }) => {
    return await common.get_whois_data(domain, cache);
  });

  messenger.onMessage(
    "get_dnssec_data",
    async ({ data: { domain, resolver } }) => {
      return await common.get_dnssec_data(domain, resolver);
    },
  );

  messenger.onMessage("get_history_data", async ({ data: { domain } }) => {
    return await history.get_history_data(domain);
  });

  messenger.onMessage("get_certificate_data", async ({ data: { domain } }) => {
    return await common.get_certificate_data(domain);
  });
}
