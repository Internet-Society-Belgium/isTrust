import axios from 'axios'
import browser from 'webextension-polyfill'

import { WebsiteInfo, WebsiteData } from '../types/communication'
import { Geolocation } from '../types/geolocation'
import { LocalStorage } from '../types/localstorage'

import { getBestRegion, getChapter } from './utils/chapter'

import getWebsiteTLD from './TLD/getWebsiteTLD'

browser.runtime.onMessage.addListener(
    async ({ url }: WebsiteInfo): Promise<WebsiteData> => {
        const website = await getWebsiteTLD(url)
        const { secure, domain } = website

        console.log(`Analyzing ${domain}`)

        const certificatePromise = website.certificate()
        const dnsPromise = website.dns()

        const [certificate, dns] = await Promise.all([
            certificatePromise,
            dnsPromise,
        ])

        return { domain, https: secure, certificate, dns }
    }
)

browser.runtime.onInstalled.addListener(async () => {
    const defaultUrl = getBestRegion(getChapter()).url
    const defaultLocalStorage: LocalStorage = {
        extension: { chapter: { url: defaultUrl } },
    }
    await browser.storage.local.set(defaultLocalStorage)

    const { status, data } = await axios.get<Geolocation>(
        `https://trest.api.progiciel.be/geolocation`
    )
    if (status !== 200) return

    const chapter = getChapter(data.country.isoCode)
    const url = getBestRegion(chapter, data.location).url
    const localStorage: LocalStorage = { extension: { chapter: { url } } }
    await browser.storage.local.set(localStorage)
})
