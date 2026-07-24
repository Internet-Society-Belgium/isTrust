import i18n from "@istrust/i18n";
import { browser, defineBackground } from "#imports";

export default defineBackground({
  persistent: false,
  main() {
    browser.runtime
      .getPlatformInfo()
      .then(({ os }) => {
        if (!(
          (import.meta.env.BROWSER === "firefox" && os === "android") ||
          import.meta.env.BROWSER === "safari-ios"
        )) {
          contextMenus();
        }
      })
      .catch(() => {
        contextMenus();
      });
  },
});

function contextMenus() {
  const lang = browser.i18n.getUILanguage();

  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType
  browser.contextMenus.create({
    id: "istrust-page",
    title: `isTrust: ${i18n("Analyze page", lang)}`,
    contexts: ["page"],
  });
  browser.contextMenus.create({
    id: "istrust-frame",
    title: `isTrust: ${i18n("Analyze frame", lang)}`,
    contexts: ["frame"],
  });
  browser.contextMenus.create({
    id: "istrust-selection",
    title: `isTrust: ${i18n("Analyze selection", lang)}`,
    contexts: ["selection"],
  });
  browser.contextMenus.create({
    id: "istrust-link",
    title: `isTrust: ${i18n("Analyze link", lang)}`,
    contexts: ["link"],
  });
  browser.contextMenus.create({
    id: "istrust-image",
    title: `isTrust: ${i18n("Analyze image", lang)}`,
    contexts: ["image"],
  });
  browser.contextMenus.create({
    id: "istrust-video",
    title: `isTrust: ${i18n("Analyze video", lang)}`,
    contexts: ["video"],
  });
  browser.contextMenus.create({
    id: "istrust-audio",
    title: `isTrust: ${i18n("Analyze audio", lang)}`,
    contexts: ["audio"],
  });

  browser.contextMenus.onClicked.addListener((info) => {
    let query;

    if (info.menuItemId === "istrust-page") {
      query = info.pageUrl;
    } else if (info.menuItemId === "istrust-frame") {
      query = info.pageUrl;
    } else if (info.menuItemId === "istrust-selection") {
      query = info.selectionText;
    } else if (info.menuItemId === "istrust-link") {
      query = info.linkUrl;
    } else if (info.menuItemId === "istrust-image") {
      query = info.srcUrl;
    } else if (info.menuItemId === "istrust-video") {
      query = info.srcUrl;
    } else if (info.menuItemId === "istrust-audio") {
      query = info.srcUrl;
    }

    if (query === undefined) {
      query = "";
    }

    query = query.trim();

    browser.windows
      .create({
        url: `${browser.runtime.getURL("/popup.html")}?q=${query}`,
        type: "popup",
        focused: true,
      })
      .catch(console.error);
  });
}
