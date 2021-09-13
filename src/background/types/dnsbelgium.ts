export interface Registration {
    domainInfo: {
        created: Date
        updated: Date
    }
    registrant: string | null
    dnsKeyInfo: {
        dnsKeys: []
    }
}

export interface Contact {
    companyName: string
}
