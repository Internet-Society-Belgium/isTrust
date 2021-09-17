export interface Chapters {
    [key: string]: Url | Region[]
}

type Url = string

export interface Region {
    url: string
    location: Location
}

export interface Location {
    longitude: number
    latitude: number
}
