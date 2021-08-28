import { Chapter, Region } from '../types/chapters'
import { Location } from '../types/geolocation'

import chapters from '../data/chapters'

export function getChapter(isoCode: string): Chapter {
    return chapters.find((c) => c.country.isoCode === isoCode) || chapters[0]
}

export function getBestRegion(
    chapter: Chapter,
    userLocation: Location
): Region {
    let best: { distance: number; region: Region } | null = null

    for (let index = 0; index < chapter.regions.length; index++) {
        const region = chapter.regions[index]

        const distance = distanceFromRegion(userLocation, region)
        if (distance && (!best || distance < best.distance)) {
            best = {
                distance,
                region,
            }
        }
    }

    return best?.region || chapter.regions[0]
}

function distanceFromRegion(userLocation: Location, region: Region) {
    if (
        !userLocation.latitude ||
        !userLocation.longitude ||
        !region.latitude ||
        !region.longitude
    )
        return

    return Math.sqrt(
        Math.pow(userLocation.latitude - region.latitude, 2) +
            Math.pow(userLocation.longitude - region.longitude, 2)
    )
}
