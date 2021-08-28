import { browser } from 'webextension-polyfill-ts'

import { WebsiteInfo, WebsiteData } from '../types/Communication'

import getWebsiteTLD from './TLD/getWebsiteTLD'

browser.runtime.onMessage.addListener(
    async ({ url }: WebsiteInfo): Promise<WebsiteData> => {
        const website = await getWebsiteTLD(url)
        const { secure, domain } = website

        console.log(`Analyzing ${domain}`)

        const certificate = await website.certificate()
        const dns = await website.dns()

        return { domain, secure, certificate, dns }
    }
)
