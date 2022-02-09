import axios from 'axios'

import { Dns } from '../../../types/dns'
import { Sidn } from '../../types/sidn'

import { Website } from '..'

export default class Website_nl extends Website {
    constructor(hostname: string) {
        super(hostname)
    }

    public async dns(): Promise<Dns | undefined> {
        const dns: Dns = { technicalError: false } as Dns

        try {
            const { status, data } = await axios.get<Sidn>(
                `https://api.sidn.nl/rest/whois?domain=${this.domain}`
            )
            if (status !== 200) {
                dns.technicalError = true
                return dns
            }

            dns.events = {
                registration: new Date(data.details.creationDate).toISOString(),
                lastChanged: new Date(data.details.updatedDate).toISOString(),
            }
            dns.registrant = {
                organisation: data.details.registrant,
            }
            dns.dnssec = data.details.dnsSec
        } catch (e) {
            dns.technicalError = true
        }

        return dns
    }
}
