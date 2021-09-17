export interface Chapters {
    [key: string]: Url | Region[]
}

type Url = string

interface Region {
    url: string
    latitude: number
    longitude: number
}
