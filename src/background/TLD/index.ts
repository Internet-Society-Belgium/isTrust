import axios from 'axios'

import { Certificate } from '../../types/certificate'
import { Dns } from '../../types/dns'

import { parseHostname } from '../utils/url'

export class Website {
    private url: string
    readonly secure: boolean
    readonly domain: string
    protected tld: string

    constructor(url: string) {
        this.url = url

        const { protocol, hostname } = new URL(url)
        const { domain, tld } = parseHostname(hostname)

        this.secure = protocol === 'https:'
        this.domain = domain
        this.tld = tld
    }

    public async certificate(): Promise<Certificate | undefined> {
        if (!this.secure) return

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
