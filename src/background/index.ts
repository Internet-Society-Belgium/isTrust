import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'
import Country from './country'
import Belgium from './country/be'

browser.runtime.onMessage.addListener(
  (res: Website, sender): Promise<WebsiteStatus> => {
    var country: Country

    if (res.hostname.endsWith('.be')) {
      country = new Belgium(res.hostname)
    } else {
      country = new Country(res.hostname)
    }

    return Promise.resolve({ dns: country.dns })
  }
)
