import browser from 'webextension-polyfill'

import { WebsiteInfo, WebsiteData } from '../types/Communication'

import getWebsiteTLD from './TLD/getWebsiteTLD'

browser.runtime.onMessage.addListener(
    async ({ url }: WebsiteInfo): Promise<WebsiteData> => {
        const website = await getWebsiteTLD(url)
        const { secure, domain } = website

        console.log(`Analyzing ${domain}`)

        const certificatePromise = website.certificate()
        const dnsPromise = website.dns()

        const [certificate, dns] = await Promise.all([
            certificatePromise,
            dnsPromise,
        ])

        return { domain, secure, certificate, dns }
    }
)
