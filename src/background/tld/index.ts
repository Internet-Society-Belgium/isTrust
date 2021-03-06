import axios from 'axios'

import { Certificate } from '../../types/certificate'
import { Dns } from '../../types/dns'

import { parseHostname } from '../utils/url'

export class Website {
    private origin: string
    readonly https: boolean
    readonly subdomain: string | null
    readonly domain: string
    protected tld: string

    constructor(url: string) {
        const { origin, protocol, hostname } = new URL(url)
        this.origin = origin
        this.https = protocol === 'https:'
        const { subdomain, domain, tld } = parseHostname(hostname)
        this.subdomain = subdomain
        this.tld = tld
        this.domain = domain
    }

    public async certificate(): Promise<Certificate | undefined> {
        if (!this.https) return

        try {
            const { status, data } = await axios.get<Certificate>(
                `https://api.istrust.org/certificate?url=${encodeURIComponent(
                    this.origin
                )}`
            )
            if (status !== 200) return

            return data
        } catch (e) {
            return
        }
    }

    public async dns(): Promise<Dns | undefined> {
        return
    }
}
