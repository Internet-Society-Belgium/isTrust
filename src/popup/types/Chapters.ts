export interface Chapters {
    country: string
    regions: Region[]
}

interface Region {
    latitude?: number
    longitude?: number
    url: string
}
