import { Location, Region } from '../types/chapters'

import { coordinateInBoundingBox, coordinateInGeometry } from './utils/geojson'
import { distanceBetweenLocations } from './utils/location'

import chapters from './chapters'
import countries from './countries'

export function getCountry(location: Location): string | undefined {
    for (const [country, data] of Object.entries(countries)) {
        if (
            coordinateInBoundingBox(
                [location.longitude, location.latitude],
                data.bbox
            )
        ) {
            if (
                coordinateInGeometry(
                    [location.longitude, location.latitude],
                    data.geometry
                )
            ) {
                return country
            }
        }
    }
    return
}

function getBestRegionUrl(
    regions: Region[],
    userLocation: Location
): string | undefined {
    let best: { distance: number; url: string } | null = null

    for (let index = 0; index < regions.length; index++) {
        const region = regions[index]

        const distance = distanceBetweenLocations(userLocation, region.location)
        if (distance && (!best || distance < best.distance)) {
            best = {
                distance,
                url: region.url,
            }
        }
    }

    return best?.url
}

export function getChapterUrl(userLocation: Location): string {
    const defaultUrl = chapters.Belgium as string

    if (!userLocation) return defaultUrl

    const country = getCountry(userLocation)
    if (!country) return defaultUrl

    const chapter = chapters[country]
    if (!chapter) return defaultUrl
    if (Array.isArray(chapter)) {
        const regionUrl = getBestRegionUrl(chapter, userLocation)
        if (!regionUrl) return defaultUrl
        return regionUrl
    } else {
        return chapter
    }
}
