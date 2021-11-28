export interface DnsBelgiumRegistration {
    domainInfo: {
        created: string
        updated: string
    }
    registrant: string | null
    dnsKeyInfo: {
        dnsKeys: []
    }
}

export interface DnsBelgiumContact {
    companyName: string
}
