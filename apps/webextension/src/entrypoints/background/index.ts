import { browser, defineBackground } from "#imports";

export default defineBackground({
  persistent: false,
  main() {
    if (
      import.meta.env.BROWSER !== "firefox-android" &&
      import.meta.env.BROWSER !== "safari-ios"
    ) {
      contextMenus();
    }
  },
});

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
