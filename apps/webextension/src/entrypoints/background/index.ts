import { onMessage } from "@/utils/messaging";
import * as common from "@istrust/common";
import { browser, defineBackground } from "#imports";
import { cache } from "./cache";
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

  onMessage(
    "get_effective_domain",
    async ({ data: { query: text, forceUpdateCache } }) => {
      if (forceUpdateCache === true) {
        await common.force_update_cache(cache);
      }

      return await common.get_effective_domain(text, cache);
    },
  );

  onMessage("get_whois_data", async ({ data: { domain } }) => {
    return await common.get_whois_data(domain, cache);
  });

  onMessage("get_dnssec_data", async ({ data: { domain, resolver } }) => {
    return await common.get_dnssec_data(domain, resolver);
  });

  onMessage("get_history_data", async ({ data: { domain } }) => {
    return await history.get_history_data(domain);
  });

  onMessage("get_certificate_data", async ({ data: { domain } }) => {
    return await common.get_certificate_data(domain);
  });
});
