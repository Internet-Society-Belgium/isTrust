import axios from 'axios'

import { Certificate } from '../../types/certificate'
import { Dns } from '../../types/dns'

import { parseHostname } from '../utils/url'

export class Website {
    private url: string
    readonly https: boolean
    readonly subdomain: string | null
    readonly domain: string
    protected tld: string

    constructor(url: string) {
        this.url = url

        const { protocol, hostname } = new URL(url)
        this.https = protocol === 'https:'
        const { subdomain, domain, tld } = parseHostname(hostname)
        this.subdomain = subdomain
        this.tld = tld
        this.domain = domain
    }

    public async certificate(): Promise<Certificate | undefined> {
        if (!this.https) return

        const { status, data } = await axios.get<Certificate>(
            `https://trest.api.progiciel.be/certificate?url=${this.url}`
        )
        if (status !== 200) return

        return data
    }

    public async dns(): Promise<Dns | undefined> {
        return
    }
}
