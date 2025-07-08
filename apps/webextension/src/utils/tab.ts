import { browser } from "#imports";

export async function getActiveTab() {
  let tab = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  while (!tab || tab.length === 0 || tab[0].status === "loading") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
  }

  return tab[0];
}
