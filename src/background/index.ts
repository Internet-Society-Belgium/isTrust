import axios from 'axios'
import browser from 'webextension-polyfill'

import { WebsiteInfo, WebsiteData } from '../types/communication'
import { Geolocation } from '../types/geolocation'

import storage from '../utils/localstorage'

import { getBestRegion, getChapter } from './chapters'
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

    const defaultUrl = getBestRegion(getChapter()).url
    await storage.extension.set({ chapter: { url: defaultUrl } })

    const { status, data } = await axios.get<Geolocation>(
        `https://istrust.api.progiciel.be/geolocation`
    )
    if (status !== 200) return
    const chapter = getChapter(data.country.isoCode)
    const url = getBestRegion(chapter, data.location).url
    await storage.extension.set({ chapter: { url } })
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
