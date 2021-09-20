import { Location, Region } from '../types/chapters'

import {
    coordinateInBoundingBox,
    coordinateInGeometry,
    distanceBetweenCoordinates,
    distanceToGeometry,
} from './utils/geojson'

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

    let best: { distance: number; country: string } | null = null

    for (const [country, data] of Object.entries(countries)) {
        const distance = distanceToGeometry(
            [location.longitude, location.latitude],
            data.geometry
        )
        if (!best || distance < best.distance) {
            best = {
                distance,
                country,
            }
        }
    }

    return best?.country
}

function getBestRegionUrl(
    regions: Region[],
    userLocation: Location
): string | undefined {
    let best: { distance: number; url: string } | null = null

    for (let index = 0; index < regions.length; index++) {
        const region = regions[index]

        const distance = distanceBetweenCoordinates(
            [userLocation.longitude, userLocation.latitude],
            [region.location.longitude, region.location.latitude]
        )
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
