import axios from 'axios'

import { Events, Registrant } from '../../types/dns'
import { IanaRDAPList, RDAPData } from '../types/rdap'

let cachedIanaRdapList: IanaRDAPList

async function updateIanaRdapList(): Promise<IanaRDAPList | undefined> {
    if (cachedIanaRdapList) return

    try {
        const { status, data } = await axios.get<IanaRDAPList>(
            `https://data.iana.org/rdap/dns.json`
        )
        if (status !== 200) return
        cachedIanaRdapList = data
    } catch (e) {
        return
    }
}

export async function getRdapUrls(tld: string): Promise<string[] | undefined> {
    await updateIanaRdapList()
    if (!cachedIanaRdapList) return

    const data = cachedIanaRdapList.services.find((e) => {
        if (e[0]) {
            return (
                e[0].findIndex((e) => e.match(new RegExp(`^${tld}$`, 'i'))) !==
                -1
            )
        }
    })
    if (!data) return

    return data[1]
}

export function getRdapLinks(data: RDAPData): string[] {
    if (!data.links) return []
    const links = data.links.filter((e) => !e.rel.match(/^self$/i))

    return links.map((e) => e.href.replace(/domain\/.*/, ''))
}

export function getRdapEvents(data: RDAPData): Events | undefined {
    const registration = data.events.find((e) =>
        e.eventAction.match(/^registration$/i)
    )
    if (!registration) return

    const transfer = data.events.find((e) => e.eventAction.match(/^transfer$/i))

    const lastChanged = data.events.find((e) =>
        e.eventAction.match(/^last changed$/i)
    )

    return {
        registration: registration.eventDate,
        transfer: transfer?.eventDate,
        lastChanged: lastChanged?.eventDate,
    }
}

export function getRdapRegistrant(data: RDAPData): Registrant | undefined {
    const company = data.entities.find((e) => {
        if (e.roles) {
            return e.roles.findIndex((r) => r.match(/^registrant$/i)) !== -1
        }
    })
    if (!company) return

    const vCard = company?.vcardArray[1]
    if (!(vCard instanceof Array)) return

    const organisationCard = vCard.find(
        (e) => typeof e[0] === 'string' && e[0].match(/^org$/i)
    )
    if (!organisationCard) return

    const organisation = organisationCard[3]
    if (typeof organisation !== 'string') return

    const locationCard = vCard.find((e) => e[0].toString().match(/^adr$/i))
    if (!locationCard) return { organisation }

    const locationCardText = locationCard[3]
    if (!Array.isArray(locationCardText)) return { organisation }

    const state = locationCardText[3]
    if (typeof state !== 'string') return { organisation }
    const region = locationCardText[4]
    if (typeof region !== 'string') return { organisation }
    const country = locationCardText[6]
    if (typeof country !== 'string') return { organisation }

    return {
        organisation,
        location: {
            state,
            region,
            country,
        },
    }
}

export function getRdapDnssec(data: RDAPData): boolean {
    return data.secureDNS?.delegationSigned || false
}
