import axios from 'axios'
import { reactive, readonly } from 'vue'
import { browser } from 'webextension-polyfill-ts'

import { Chapter } from '../types/chapters'
import { Geolocation, Location } from '../types/geolocation'

import chapters from '../data/chapters'

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

        const defaultChapterUrl = chapters[0].regions[0].url

        const chapter = chapters.find((c) => c.country === data.country.isoCode)

        if (!chapter) {
            extensionStates.chapter.url = defaultChapterUrl
            return
        }

        extensionStates.chapter.url = getBestRegion(chapter, data.location).url

        await browser.storage.local.set({ extension: extensionStates })
    }
}

function getBestRegion(chapter: Chapter, userLocation: Location) {
    let best = { distance: 1000, region: chapter.regions[0] }

    for (let index = 1; index < chapter.regions.length; index++) {
        const region = chapter.regions[index]

        if (
            userLocation.latitude &&
            userLocation.longitude &&
            region.latitude &&
            region.longitude
        ) {
            const distance = Math.sqrt(
                Math.pow(userLocation.latitude - region.latitude, 2) +
                    Math.pow(userLocation.longitude - region.longitude, 2)
            )
            if (best.distance > distance) {
                best = {
                    distance,
                    region,
                }
            }
        }
    }

    return best.region
}

getChapterUrl()
