import {
    BoundingBox,
    Coordinates,
    Geometry,
    Polygon,
} from '../../types/countries'

export function coordinateInBoundingBox(
    coordinate: Coordinates,
    boundingbox: BoundingBox
): boolean {
    return (
        coordinate[0] > boundingbox[0] &&
        coordinate[1] > boundingbox[1] &&
        coordinate[0] < boundingbox[2] &&
        coordinate[1] < boundingbox[3]
    )
}

export function coordinateInGeometry(
    coordinates: Coordinates,
    geometry: Geometry
): boolean {
    if (geometry.type === 'Polygon') {
        const geometryCoordinates = geometry.coordinates as Polygon[]
        for (const polygon of geometryCoordinates) {
            if (coordinateInPolygon(coordinates, polygon)) return true
        }
    } else if (geometry.type === 'MultiPolygon') {
        const geometryCoordinates = geometry.coordinates as Polygon[][]
        for (const geometryCoordinate of geometryCoordinates) {
            for (const polygon of geometryCoordinate) {
                if (coordinateInPolygon(coordinates, polygon)) return true
            }
        }
    }
    return false
}

// https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
function coordinateInPolygon(
    coordinates: Coordinates,
    polygon: Polygon
): boolean {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const long_i = polygon[i][0],
            lat_i = polygon[i][1]
        const long_j = polygon[j][0],
            lat_j = polygon[j][1]

        const intersect =
            lat_i > coordinates[1] != lat_j > coordinates[1] &&
            coordinates[0] <
                ((long_j - long_i) * (coordinates[1] - lat_i)) /
                    (lat_j - lat_i) +
                    long_i
        if (intersect) inside = !inside
    }
    return inside
}
