import { browser } from 'webextension-polyfill-ts'
import { WebsiteInfo, WebsiteData } from '../types/Communication'
import getWebsiteTLD from './TLD/getWebsiteTLD'

browser.runtime.onMessage.addListener(
  async ({ hostname }: WebsiteInfo): Promise<WebsiteData> => {
    const website = await getWebsiteTLD(hostname)
    const domain = website.domain

    console.log(`Analyzing ${domain}`)

    const data = await website.data()

    return { domain, data }
  }
)
