import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'
import { getCountry } from './country'

browser.runtime.onMessage.addListener(
  ({ hostname }: Website): Promise<WebsiteStatus> => {
    return new Promise(async (resolve, reject) => {
      const country = await getCountry(hostname)
      const domain = country.domain

      console.log(`Analyzing ${domain}`)

      resolve({ domain, dns: await country.dns })
    })
  }
)
