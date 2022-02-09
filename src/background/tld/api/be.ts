import axios from 'axios'

import { Dns } from '../../../types/dns'
import {
    DnsBelgiumContact,
    DnsBelgiumRegistration,
} from '../../types/dnsbelgium'

import { Website } from '..'

export default class Website_be extends Website {
    constructor(hostname: string) {
        super(hostname)
    }

    public async dns(): Promise<Dns | undefined> {
        const dns: Dns = { technicalError: false }

        try {
            const { status: registrationStatus, data: registration } =
                await axios.get<DnsBelgiumRegistration>(
                    `https://api.dnsbelgium.be/whois/registration/${this.domain}`
                )
            if (registrationStatus !== 200) {
                dns.technicalError = true
                return dns
            }

            dns.events = {
                registration: new Date(
                    registration.domainInfo.created
                ).toISOString(),
                lastChanged: new Date(
                    registration.domainInfo.updated
                ).toISOString(),
            }
            dns.dnssec = registration.dnsKeyInfo.dnsKeys.length !== 0

            let contact: string | null = null

            if (registration.registrant) {
                contact = registration.registrant
            } else if (
                registration.onsiteCompanyContacts &&
                Array.isArray(registration.onsiteCompanyContacts) &&
                registration.onsiteCompanyContacts.length > 0
            ) {
                contact = registration.onsiteCompanyContacts[0]
            }

            if (contact) {
                const { status: registrantStatus, data: registrant } =
                    await axios.get<DnsBelgiumContact>(
                        `https://api.dnsbelgium.be/whois/contact/${contact}`
                    )
                if (registrantStatus !== 200) {
                    dns.technicalError = true
                    return dns
                }

                if (registrant?.companyName) {
                    dns.registrant = {
                        organisation: registrant.companyName,
                        location: {
                            state: registrant.city,
                            region: '',
                            country: registrant.country,
                        },
                    }
                }
            }
        } catch (e) {
            dns.technicalError = true
        }

        return dns
    }
}
