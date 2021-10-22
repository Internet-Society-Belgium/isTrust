import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { WebsiteData } from '../../types/communication'
import {
    StoreWebsite,
    StoreWebsiteMethods,
    StoreWebsiteStates,
} from '../types/store/website'

import storage from '../../utils/localstorage'
import { getCurrentTab } from '../../utils/tab'

const websiteStates: StoreWebsiteStates = reactive({
    internal: false,
    loading: true,
})

const websiteMethods: StoreWebsiteMethods = {
    async reload(): Promise<void> {
        const tab = await getCurrentTab()
        if (!tab?.url) return
        const { origin } = new URL(tab.url)
        if (!origin) return
        await storage.cache.remove(origin)
        await browser.tabs.reload()
        await init()
    },
    async goToHttps(): Promise<void> {
        const tab = await getCurrentTab()
        if (!tab?.url) return
        await browser.tabs.update({
            url: tab.url.replace('http://', 'https://'),
        })
        website?.methods.reload()
    },
}

const website: StoreWebsite = {
    states: readonly(websiteStates),
    methods: websiteMethods,
}

export default website

async function init() {
    websiteStates.loading = true
    websiteStates.data = undefined

    websiteStates.internal = await isInternal()

    if (!websiteStates.internal) {
        const data: WebsiteData | undefined = await browser.runtime.sendMessage(
            {
                cacheOnly: false,
            }
        )
    websiteStates.data = data
    }

    websiteStates.loading = false
}

async function isInternal(): Promise<boolean> {
    const tab = await getCurrentTab()
    return !tab.url
}

;(async () => {
    await init()
})()
