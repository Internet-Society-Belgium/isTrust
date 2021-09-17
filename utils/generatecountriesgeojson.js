const axios = require('axios')
const path = require('path')
const fs = require('fs')

const outputFile = path.resolve(
    __dirname,
    '../src/background/chapters/countries.ts'
)

;(async () => {
    const { status, data } = await axios.get(
        `https://github.com/nvkelso/natural-earth-vector/raw/master/geojson/ne_110m_admin_0_countries.geojson`
    )

    if (status !== 200) return

    const cleanedData = {}

    data.features
        .sort((a, b) => b.properties.POP_RANK - a.properties.POP_RANK)
        .forEach((f) => {
            cleanedData[f.properties.NAME] = {
                bbox: f.bbox,
                geometry: f.geometry,
            }
        })

    fs.writeFileSync(
        outputFile,
        `
import { Countries } from "../types/countries";
const countries: Countries = ${JSON.stringify(cleanedData, null, 2)}
export default countries`
    )
})()
