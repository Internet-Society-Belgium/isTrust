export interface Chapter {
    country: Country
    regions: Region[]
}

interface Country {
    isoCode: string // ISO 3166-1 alpha-2
}

export interface Region {
    url: string
    latitude?: number
    longitude?: number
}
