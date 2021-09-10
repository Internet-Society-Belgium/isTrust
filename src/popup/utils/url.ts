import browser from 'webextension-polyfill'

export async function openUrl(url: string): Promise<void> {
    await browser.tabs.create({ url })
}
