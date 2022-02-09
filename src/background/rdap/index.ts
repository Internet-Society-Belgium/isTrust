import axios from 'axios'

import { Events, Registrant } from '../../types/dns'
import { IanaRDAPList, RDAPData, Vcard, VcardProperty } from '../types/rdap'

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
        if (!e[0]) return
        return (
            e[0].findIndex((e) => e.match(new RegExp(`^${tld}$`, 'i'))) !== -1
        )
    })
    if (!data) return

    return data[1]
}

export function getRdapLinks(data: RDAPData): string[] {
    if (!data.links) return []
    const links = data.links.filter((e) => {
        if (!e.rel || typeof e.rel !== 'string') return
        return e.rel.match(/^related$/i)
    })

    return links.map((e) => e.href.replace(/domain\/.*/, ''))
}

export function getRdapEvents(data: RDAPData): Events | undefined {
    const registrationEvent = data.events.find((e) => {
        if (!e.eventAction && typeof e.eventAction === 'string') return
        return e.eventAction.match(/^registration$/i)
    })
    if (!registrationEvent || !registrationEvent.eventDate) return
    const registration = new Date(registrationEvent.eventDate).toISOString()

    const lastChangedEvent = data.events.find((e) => {
        if (!e.eventAction || typeof e.eventAction !== 'string') return
        return e.eventAction.match(/^last changed$/i)
    })
    if (!lastChangedEvent || !lastChangedEvent.eventDate)
        return { registration }

    const lastChanged = new Date(lastChangedEvent?.eventDate).toISOString()
    return { registration, lastChanged }
}

export function getRdapRegistrant(data: RDAPData): Registrant | undefined {
    const registrant = data.entities.find((e) => {
        if (!e.roles || !Array.isArray(e.roles)) return
        return e.roles.findIndex((r) => r.match(/^registrant$/i)) !== -1
    })

    if (!registrant) return

    const vcardArray = registrant?.vcardArray
    if (!Array.isArray(vcardArray)) return

    let vcard: Vcard = []
    if (vcardArray.length === 1) {
        if (Array.isArray(vcardArray[0])) {
            vcard = vcardArray[0] as Vcard
        }
    } else if (vcardArray.length === 2) {
        if (Array.isArray(vcardArray[1])) {
            vcard = vcardArray[1] as Vcard
        }
    } else if (vcardArray.length > 2) {
        vcardArray.forEach((c) => {
            if (Array.isArray(c)) {
                const v = c as VcardProperty
                vcard.push(v)
            }
        })
    }
    if (vcard.length === 0) return

    const organisation = getOrganisation(vcard)
    if (!organisation) return

    const location = getLocation(vcard)
    if (!location) return { organisation }

    return { organisation, location }
}

function getOrganisation(vcard) {
    const organisationCard = vcard.find(
        (e) => typeof e[0] === 'string' && e[0].match(/^org$/i)
    )
    if (!organisationCard) return

    const organisation = organisationCard[3]
    if (typeof organisation !== 'string') return

    return organisation
}

function getLocation(vcard) {
    const locationCard = vcard.find((e) => e[0].toString().match(/^adr$/i))
    if (!locationCard) return

    const locationCardText = locationCard[3]
    if (!Array.isArray(locationCardText)) return

    const state = locationCardText[3]
    if (typeof state !== 'string') return
    const region = locationCardText[4]
    if (typeof region !== 'string') return
    const country = locationCardText[6]
    if (typeof country !== 'string') return

    return { state, region, country }
}

export function getRdapDnssec(data: RDAPData): boolean | undefined {
    return data.secureDNS?.delegationSigned
}
