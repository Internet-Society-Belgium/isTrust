import { RDAP } from '../utils/rdap'
import { parseHostname } from '../utils/url'

import { Website } from '.'
import Website_be from './api/be'
import Website_port43 from './port43'
import Website_rdap from './rdap'

export default function (url: string): Website {
    const { hostname } = new URL(url)
    const { tld } = parseHostname(hostname)

    if (tld === 'be') {
        return new Website_be(url)
    }

    if (RDAP.urls(tld)) {
        return new Website_rdap(url)
    }

    if (tld === 'fr') {
        return new Website_port43(url)
    }

    return new Website(url)
}
