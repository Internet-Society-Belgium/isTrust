import { Location } from '../types/chapters'

import chapters from './data'

function distanceFromRegion(userLocation: Location, chapterLocation: Location) {
    if (
        !userLocation.latitude ||
        !userLocation.longitude ||
        !chapterLocation.latitude ||
        !chapterLocation.longitude
    )
        return

    return Math.sqrt(
        Math.pow(userLocation.latitude - chapterLocation.latitude, 2) +
            Math.pow(userLocation.longitude - chapterLocation.longitude, 2)
    )
}

export function getChapterUrl(userLocation: Location): string {
    if (!userLocation) return chapters[0].url

    let best: { distance: number; url: string } | null = null

    for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index]

        const distance = distanceFromRegion(userLocation, chapter.location)
        if (distance && (!best || distance < best.distance)) {
            best = {
                distance,
                url: chapter.url,
            }
        }
    }

    return best?.url || chapters[0].url
}
