import browser from 'webextension-polyfill'

import { WebsiteData } from '../types/communication'

import storage from '../utils/localstorage'
import { getCurrentTab } from '../utils/tab'
import { getScores } from './utils/score'

import { getChapterUrl } from './chapters'
import getWebsiteTLD from './tld/getWebsiteTLD'

browser.runtime.onMessage.addListener(
    async ({
        cacheOnly,
    }: {
        cacheOnly: boolean
    }): Promise<WebsiteData | undefined> => {
        const tab = await getCurrentTab()
        if (!tab.id || !tab?.url) return
        const { origin } = new URL(tab.url)
        if (!origin) return

        const cachedData = await storage.cache.get(origin)
        if (cachedData) {
            return cachedData
        }

        if (cacheOnly) return
        try {
            const website = await getWebsiteTLD(tab.url)

            const { https, subdomain, domain } = website

            const certificatePromise = website.certificate()
            const dnsPromise = website.dns()

            const [certificate, dns] = await Promise.all([
                certificatePromise,
                dnsPromise,
            ])

            const scores = getScores({
                url: {
                    https,
                    subdomain,
                    domain,
                },
                certificate,
                dns,
            })

            const data = {
                url: {
                    https,
                    subdomain,
                    domain,
                },
                scores,
                certificate,
                dns,
            }

            await storage.cache.set(origin, data)

            return data
        } catch (e) {
            return
        }
    }
)

browser.runtime.onInstalled.addListener(async () => {
    await storage.cache.clear()
    await storage.extension.clear()

    navigator.geolocation.getCurrentPosition(
        async (location: GeolocationPosition) => {
            const longitude = location.coords.longitude
            const latitude = location.coords.latitude
            const chapterUrl = getChapterUrl({ longitude, latitude })
            await storage.extension.set({ chapterUrl })
        }
    )
})

browser.alarms.create('clear_outdated_cache', {
    delayInMinutes: 1,
    periodInMinutes: 60 * 24,
})
browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'clear_outdated_cache') {
        await storage.cache.clearOutdated()
    }
})

browser.contextMenus.create({
    id: 'clear_cache',
    title: browser.i18n.getMessage('clear_cache'),
    contexts: ['browser_action'],
})
browser.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === 'clear_cache') {
        await storage.cache.clear()
    }
})
