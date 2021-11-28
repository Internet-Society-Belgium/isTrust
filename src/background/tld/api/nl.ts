import axios from 'axios'

import { Dns } from '../../../types/dns'
import { Sidn } from '../../types/sidn'

import { Website } from '..'

export default class Website_nl extends Website {
    constructor(hostname: string) {
        super(hostname)
    }

    public async dns(): Promise<Dns | undefined> {
        try {
            const { status, data } = await axios.get<Sidn>(
                `https://api.sidn.nl/rest/whois?domain=${this.domain}`
            )
            if (status !== 200) return

            const dns: Dns = {
                events: {
                    registration: new Date(
                        data.details.creationDate
                    ).toISOString(),
                    lastChanged: new Date(
                        data.details.updatedDate
                    ).toISOString(),
                },
                registrant: {
                    organisation: data.details.registrant,
                },
                dnssec: data.details.dnsSec,
            }

            return dns
        } catch (e) {
            return
        }
    }
}
