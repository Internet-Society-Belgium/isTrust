import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { WebsiteData } from '../../types/Communication'
import { Cookie } from '../../types/Cookie'
import {
    StoreWebsite,
    StoreWebsiteMethods,
    StoreWebsiteStates,
} from '../types/store/website'

const websiteStates: StoreWebsiteStates = reactive({
    internal: false,
    loading: false,
    data: {} as WebsiteData,
})

const websiteMethods: StoreWebsiteMethods = {
const websiteMethods = {
    async refresh(): Promise<void> {
        websiteStates.data = {} as WebsiteData

        const tab = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
        if (!tab) return
        const id = tab[0].id
            const url = tab[0].url
        if (!id || !url) return
        const { origin } = new URL(url)
            if (!origin) return

            await browser.cookies.remove({
                url: `${origin}/trest`,
            name: 'trest',
            })

        await getData()

        await browser.tabs.reload(id)
    },
}

const website: StoreWebsite = {
    states: readonly(websiteStates),
    methods: websiteMethods,
}

export default website

async function getData() {
    const tab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    })
    if (!tab) return
    const id = tab[0].id
    const url = tab[0].url
    if (!id || !url) return
    const { protocol, origin } = new URL(url)
    if (!protocol || !origin) return

    if (!['http:', 'https:'].includes(protocol)) {
        websiteStates.internal = true
        websiteStates.loading = false
        return
    }

    let cookie = await browser.cookies.get({
        url: `${origin}/trest`,
        name: 'trest',
    })

    let cookieData: Cookie | undefined

    if (cookie) {
        cookieData = JSON.parse(cookie.value)
    }

    const extensionVersion = await browser.runtime.getManifest().version

    if (!cookieData || cookieData.version !== extensionVersion) {
        websiteStates.loading = true
        try {
            await browser.tabs.sendMessage(id, {})
        } catch (e) {
            await browser.tabs.reload(id)
            await getData()
            return
        }
        cookie = await browser.cookies.get({
            url: `${origin}/trest`,
            name: 'trest',
        })
    }

    if (cookie) {
        websiteStates.data = JSON.parse(cookie.value)
        websiteStates.loading = false
    }
}

getData()
