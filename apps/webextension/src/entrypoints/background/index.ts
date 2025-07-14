import { onMessage } from "@/utils/messaging";
import { browser, defineBackground } from "#imports";
import { cache } from "./cache";
import * as common from "@istrust/common";
import * as history from "./history";

export default defineBackground(() => {
  browser.contextMenus.create({
    id: "istrust",
    title: "isTrust",
    contexts: ["link"],
  });
  browser.contextMenus.onClicked.addListener(async (info) => {
    const text = info?.linkUrl;
    if (!text) return;

    await browser.windows.create({
      url: `${browser.runtime.getURL("/popup.html")}?q=${text}`,
      type: "popup",
      focused: true,
    });
  });

  browser.runtime.onInstalled.addListener(async () => {
    return await common.update_cache(cache);
  });

  onMessage("get_effective_domain", async ({ data: { query } }) => {
    return await common.get_effective_domain(query, cache);
  });

  onMessage("get_whois_data", async ({ data: { domain } }) => {
    return await common.get_whois_data(domain, cache);
  });

  onMessage("is_dnssec_valid", async ({ data: { domain, resolver } }) => {
    return await common.is_dnssec_valid(domain, resolver);
  });

  onMessage("get_history_data", async ({ data: { domain } }) => {
    return await history.get_history_data(domain);
  });

  onMessage("force_update_cache", async () => {
    return await common.force_update_cache(cache);
  });
});
