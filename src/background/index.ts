import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'
import Country from './country'
import Belgium from './country/be'
import psl from 'psl'

browser.runtime.onMessage.addListener(
  ({ hostname }: Website): Promise<WebsiteStatus> => {
    return new Promise(async (resolve, reject) => {
      const domain = psl.get(hostname)
      if (domain) {
        console.log(`Analyzing ${domain}`)

        var country: Country

        if (domain.endsWith('.be')) {
          country = new Belgium(domain)
        } else {
          country = new Country(domain)
        }

        resolve({ domain, dns: await country.dns })
      }
    })
  }
)
