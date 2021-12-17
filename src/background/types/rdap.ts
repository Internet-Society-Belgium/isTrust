export interface IanaRDAPList {
    description: string
    publication: Date
    services: string[][][]
    version: string
}

export interface RDAPData {
    secureDNS: SecureDNS
    links: RDAPLink[]
    entities: Entity[]
    events: Event[]
}

interface RDAPLink {
    value: string
    rel: string
    href: string
    type: string
}

interface Entity {
    roles: string[]
    vcardArray: (string | Vcard)[] | VcardProperty[]
}

export type Vcard = VcardProperty[]
export type VcardProperty = string[]

interface Event {
    eventDate: Date
    eventAction: string
}

interface SecureDNS {
    dsData: DsDatum[]
    delegationSigned: boolean
}

interface DsDatum {
    algorithm: number
    digestType: number
    digest: string
    keyTag: number
}
