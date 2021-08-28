import axios from 'axios'
import { reactive, readonly } from 'vue'
import { browser } from 'webextension-polyfill-ts'

import { Geolocation } from '../types/geolocation'

import { getBestRegion, getChapter } from '../utils/chapter'

const extensionStates = reactive({
    chapter: {
        url: '',
    },
})

export default {
    version: browser.runtime.getManifest().version,
    i18n(message: string): string {
        return browser.i18n.getMessage(message)
    },
    states: readonly(extensionStates),
}

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
