import axios from 'axios'
import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { Geolocation } from '../types/geolocation'
import {
    StoreExtension,
    StoreExtensionConstants,
    StoreExtensionMethods,
    StoreExtensionStates,
} from '../types/store/extension'

import { getBestRegion, getChapter } from '../utils/chapter'

const extensionConstants: StoreExtensionConstants = {
    version: browser.runtime.getManifest().version,
}

const extensionStates: StoreExtensionStates = reactive({
    chapter: {
        url: '',
    },
})

const extensionMethods: StoreExtensionMethods = {
    i18n(message: string): string {
        return browser.i18n.getMessage(message)
    },
}

const extension: StoreExtension = {
    constants: extensionConstants,
    states: readonly(extensionStates),
    methods: extensionMethods,
}

export default extension

async function getChapterUrl() {
    const { extension } = await browser.storage.local.get('extension')
    if (extension) {
        extensionStates.chapter.url = extension.chapter.url
    } else {
        const { status, data } = await axios.get<Geolocation>(
            `https://trest.api.progiciel.be/geolocation`
        )

        if (status !== 200) return

        const chapter = getChapter(data.country.isoCode)

        extensionStates.chapter.url = getBestRegion(chapter, data.location).url

        await browser.storage.local.set({ extension: extensionStates })
    }
}

getChapterUrl()
