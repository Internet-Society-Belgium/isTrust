import browser from 'webextension-polyfill'

import { Score } from '../types/score'

export async function setIcon({
    origin,
    score,
    tabId,
}: {
    origin?: string
    score?: Score
    tabId?: number
}): Promise<void> {
    const path =
        score === 'ok'
            ? {
                  48: '/icons/ok/icon.png',
                  96: '/icons/ok/icon@2x.png',
              }
            : score === 'neutral'
            ? {
                  48: '/icons/neutral/icon.png',
                  96: '/icons/neutral/icon@2x.png',
              }
            : score === 'warning'
            ? {
                  48: '/icons/warning/icon.png',
                  96: '/icons/warning/icon@2x.png',
              }
            : {
                  48: '/icons/icon.png',
                  96: '/icons/icon@2x.png',
              }

    if (tabId) {
        browser.browserAction.setIcon({ tabId, path })
    } else {
        if (!origin) return

        const tabs = await browser.tabs.query({})

        for (const tab of tabs) {
            if (!tab.id || !tab.url) continue

            const { origin: tabOrigin } = new URL(tab.url)

            if (tabOrigin === origin) {
                browser.browserAction.setIcon({ tabId: tab.id, path })
            }
        }
    }
}
