import axios from 'axios'

import { Dns } from '../../../types/dns'
import { Contact, Registration } from '../../types/dnsbelgium'

import { Website } from '..'

export default class Website_be extends Website {
    constructor(hostname: string) {
        super(hostname)
    }

    public async dns(): Promise<Dns | undefined> {
        try {
            const { status: registrationStatus, data: registration } =
                await axios.get<Registration>(
                    `https://api.dnsbelgium.be/whois/registration/${this.domain}`
                )
            if (registrationStatus !== 200) return

            const dns: Dns = {
                events: {
                    registration: registration.domainInfo.created,
                    lastChanged: registration.domainInfo.updated,
                },
                dnssec: registration.dnsKeyInfo.dnsKeys.length !== 0,
            }

            if (registration.registrant) {
                const { status: registrantStatus, data: registrant } =
                    await axios.get<Contact>(
                        `https://api.dnsbelgium.be/whois/contact/${registration.registrant}`
                    )

                if (registrantStatus === 200) {
                    if (registrant?.companyName) {
                        dns.registrant = {
                            organisation: registrant.companyName,
                        }
                    }
                }
            }

            return dns
        } catch (e) {
            return
        }
    }
}
