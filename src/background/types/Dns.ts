export interface Dns {
  events: Events
  registrant: Registrant
  dnssec: boolean
}

export interface Events {
  registration: Date
  lastChanged?: Date
  expiration?: Date
  transfer?: Date
}

export interface Registrant {
  organisation: string
}
