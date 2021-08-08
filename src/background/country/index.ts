import * as psl from 'psl'
import { Country } from './all'
import Belgium from './be'

export function getCountry(hostname: string): Promise<Country> {
  return new Promise((resolve, reject) => {
    const parsedHostname = psl.parse(hostname)
    if (parsedHostname?.error) return reject()

    const { domain, tld } = parsedHostname
    if (!domain || !tld) return reject()

    if (['be', 'brussels', 'vlaanderen'].includes(tld)) {
      resolve(new Belgium(domain))
    }
    resolve(new Country(domain))
  })
}
