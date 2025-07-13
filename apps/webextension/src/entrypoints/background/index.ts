import { onMessage } from "@/utils/messaging";
import { browser, defineBackground } from "#imports";
import { cache } from "./cache";
import * as common from "@istrust/common";

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

  onMessage("whois", async ({ data: { domain } }) => {
    return await common.whois(domain, cache);
  });

  onMessage("force_update_cache", async () => {
    return await common.force_update_cache(cache);
  });
});
