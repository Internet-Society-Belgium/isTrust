import { browser } from "#imports";

async function get_tab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs.at(0);
}

export async function get_active_tab() {
  let tab = await get_tab();

  while (tab === undefined) {
    tab = await get_tab();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return tab;
}
