export interface DnsBelgiumRegistration {
    domainInfo: {
        created: string
        updated: string
    }
    registrant: string | null
    onsiteCompanyContacts: string[]
    dnsKeyInfo: {
        dnsKeys: []
    }
}

export interface DnsBelgiumContact {
    companyName: string
}
