export interface Chapters {
    country: string
    url: Url
}

interface Url {
    _: string
    [key: string]: string
}
