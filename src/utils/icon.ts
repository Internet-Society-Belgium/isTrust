import browser from 'webextension-polyfill'

import { Score } from '../types/score'

export async function setIcon({
    tabId,
    score,
}: {
    tabId: number
    score?: Score
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

    if (!path) return

    await browser.browserAction.setIcon({ tabId, path })
}
