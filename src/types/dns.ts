export interface Dns {
    events: Events
    registrant?: Registrant
    dnssec: boolean
}

export interface Events {
    registration: Date
    lastChanged?: Date
}

export interface Registrant {
    organisation: string
    location?: {
        state: string
        region: string
        country: string
    }
}
