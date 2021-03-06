import * as psl from 'psl'

import { UrlParsed } from '../types/url'

export function parseHostname(hostname: string): UrlParsed {
    const parsedHostname = psl.parse(hostname)
    if (parsedHostname?.error) throw new Error(parsedHostname.error.message)

    const { subdomain, domain, tld } = parsedHostname
    if (!domain) throw new Error('no domain found')
    if (!tld) throw new Error('no tld found')
    return {
        subdomain,
        domain,
        tld,
    }
}
