import browser from 'webextension-polyfill'

import { WebsiteInfo, WebsiteData } from '../types/communication'

import storage from '../utils/localstorage'

import { getChapterUrl } from './chapters'
import getWebsiteTLD from './tld/getWebsiteTLD'

browser.runtime.onMessage.addListener(
    async ({ url }: WebsiteInfo): Promise<WebsiteData> => {
        const website = await getWebsiteTLD(url)
        const { https, subdomain, domain } = website

        const certificatePromise = website.certificate()
        const dnsPromise = website.dns()

        const [certificate, dns] = await Promise.all([
            certificatePromise,
            dnsPromise,
        ])

        return {
            url: {
                https,
                subdomain,
                domain,
            },
            certificate,
            dns,
        }
    }
)

browser.runtime.onInstalled.addListener(async () => {
    await storage.cache.clear()
    await storage.extension.clear()

    navigator.geolocation.getCurrentPosition(
        async (location: GeolocationPosition) => {
            const latitude = location.coords.latitude
            const longitude = location.coords.longitude
            const chapterUrl = getChapterUrl({ latitude, longitude })
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
