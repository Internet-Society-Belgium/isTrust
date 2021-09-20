const axios = require('axios')
const path = require('path')
const fs = require('fs')
const prettier = require('prettier')

const chaptersFile = path.resolve(
    __dirname,
    '../src/background/chapters/chapters.ts'
)
const countriesFile = path.resolve(
    __dirname,
    '../src/background/chapters/countries.ts'
)

;(async () => {
    const { status: status110, data: data110 } = await axios.get(
        `https://github.com/nvkelso/natural-earth-vector/raw/master/geojson/ne_110m_admin_0_countries.geojson`
    )
    if (status110 !== 200) return
    const { status: status50, data: data50 } = await axios.get(
        `https://github.com/nvkelso/natural-earth-vector/raw/master/geojson/ne_50m_admin_0_countries.geojson`
    )
    if (status50 !== 200) return
    const cleanedData = {}

    const chaptersTs = fs.readFileSync(chaptersFile).toString()

    chaptersRaw = chaptersTs
        .replace(`import { Chapters, Url } from '../types/chapters'`, '')
        .replace(
            `export const defaultUrl: Url = 'https://www.istrust.org/'`,
            ''
        )
        .replace(`export const chapters: Chapters = `, '')

    const chapters = JSON.parse(
        prettier.format(chaptersRaw, {
            parser: 'json',
        })
    )

    for (const key in chapters) {
        if (Object.hasOwnProperty.call(chapters, key)) {
            let country = data110.features.find(
                (f) => f.properties.NAME === key
            )
            if (!country) {
                country = data50.features.find((f) => f.properties.NAME === key)
            }
            if (!country) throw new Error(`No country for ${key}`)

            cleanedData[key] = {
                POP_RANK: country.properties.POP_RANK,
                bbox: country.bbox,
                geometry: country.geometry,
            }
        }
    }

    const cleanedDataOrdered = Object.keys(cleanedData)
        .sort((a, b) => cleanedData[b].POP_RANK - cleanedData[a].POP_RANK)
        .reduce((obj, key) => {
            obj[key] = {
                bbox: cleanedData[key].bbox,
                geometry: cleanedData[key].geometry,
            }
            return obj
        }, {})

    const config = await prettier.resolveConfig('.prettierrc.js')

    fs.writeFileSync(
        countriesFile,
        prettier.format(
            `
        import { Countries } from "../types/countries";
        const countries: Countries = ${JSON.stringify(
            cleanedDataOrdered,
            null,
            2
        )}
        export default countries`,
            {
                parser: 'typescript',
                ...config,
            }
        )
    )
})()
