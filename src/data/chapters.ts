import { Chapter } from '../background/types/chapters'

const chapters: Chapter[] = [
    {
        country: {
            isoCode: 'BE',
        },
        regions: [
            {
                url: 'https://www.internetsociety.be/',
            },
        ],
    },
    {
        country: {
            isoCode: 'FR',
        },
        regions: [
            {
                url: 'https://www.isoc.fr/',
            },
        ],
    },
    {
        country: {
            isoCode: 'US',
        },
        regions: [
            {
                url: 'https://isoc-ny.org/',
                latitude: 40.6973,
                longitude: -74.0657,
            },
            {
                url: 'https://www.sfbayisoc.org/',
                latitude: 37.7953,
                longitude: -122.3558,
            },
        ],
    },
]

export default chapters
