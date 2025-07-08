import { onMessage } from "@/utils/messaging";
import { history } from "./history";
import { browser, defineBackground } from "#imports";

export default defineBackground(() => {
  onMessage("history", async ({ data: { domain } }) => {
    return await history({
      domain,
    });
  });

  browser.contextMenus.create({
    id: "istrust",
    title: "isTrust",
    contexts: ["link"], // TODO email
  });
  browser.contextMenus.onClicked.addListener(async (info) => {
    const url = info?.linkUrl;
    if (!url) return;

    await browser.windows.create({
      url: `${browser.runtime.getURL("/popup.html")}?url=${url}`,
      type: "popup",
      focused: true,
    });
  });
});
