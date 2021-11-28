export interface DnsBelgiumRegistration {
    domainInfo: {
        created: Date
        updated: Date
    }
    registrant: string | null
    dnsKeyInfo: {
        dnsKeys: []
    }
}

export interface DnsBelgiumContact {
    companyName: string
}
