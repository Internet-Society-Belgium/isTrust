export interface Countries {
    [key: string]: {
        bbox: BoundingBox
        geometry: Geometry
    }
}

export type BoundingBox = [number, number, number, number] // [longitude-0, latitude-0, longitude-1, latitude-1]

export interface Geometry {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: Polygon[] | Polygon[][]
}

export type Coordinates = [number, number] // [longitude, latitude]
export type Polygon = Coordinates[]
