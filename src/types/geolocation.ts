export interface Geolocation {
    country: {
        isoCode: string // ISO 3166-1 alpha-2
    }
    location: Location
}

export interface Location {
    latitude?: number
    longitude?: number
}
