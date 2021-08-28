import { Certificate } from '../../types/Certificate'
import { Dns } from '../../types/Dns'

import { parseHostname } from '../utils/url'

export class Website {
    readonly secure: boolean
    readonly domain: string
    protected tld: string

    constructor(url: string) {
        const { protocol, hostname } = new URL(url)
        const { domain, tld } = parseHostname(hostname)

        this.secure = protocol === 'https:'
        this.domain = domain
        this.tld = tld
    }

    public async certificate(): Promise<Certificate | undefined> {
        if (!this.secure) return

        return {
            organisation: '',
        }
    }

    public async dns(): Promise<Dns | undefined> {
        return
    }
}
