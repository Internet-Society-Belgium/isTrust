export interface Registration {
  domainInfo: {
    created: Date
    updated: Date
  }
  registrant: string
  dnsKeyInfo: {
    dnsKeys: []
  }
}

export interface Contact {
  companyName: string
}
