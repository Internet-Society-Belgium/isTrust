import { parseHostname } from '../utils/url'

import { Website } from '.'
import { getRdapUrls } from '../rdap'
import Website_be from './api/be'
import Website_port43 from './port43'
import Website_rdap from './rdap'

export default async function (url: string): Promise<Website> {
    const { hostname } = new URL(url)
    const { tld } = parseHostname(hostname)

    if (tld === 'be') {
        return new Website_be(url)
    }

    const urls = await getRdapUrls(tld)
    if (urls) {
        return new Website_rdap(url)
    }

    if (tld === 'fr') {
        return new Website_port43(url)
    }

    return new Website(url)
}
