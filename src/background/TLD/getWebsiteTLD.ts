import { parseHostname } from '../utils/url'

import { Website } from '.'
import Website_be from './api/be'
import Website_rdap from './rdap'

export default function (url: string): Website {
    const { hostname } = new URL(url)
    const { tld } = parseHostname(hostname)

    if (tld === 'be') {
        return new Website_be(url)
    }
    return new Website_rdap(url)
}
