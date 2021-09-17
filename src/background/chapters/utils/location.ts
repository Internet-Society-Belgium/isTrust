import { Location } from '../../types/chapters'

export function distanceBetweenLocations(
    p1: Location,
    p2: Location
): number | undefined {
    if (!p1.longitude || !p1.latitude || !p2.longitude || !p2.latitude) return

    return Math.sqrt(
        Math.pow(p1.longitude - p2.longitude, 2) +
            Math.pow(p1.latitude - p2.latitude, 2)
    )
}
