export interface DNS {
  country: string | null
  domainInfo?: {
    created: string
    updated: string
  }
  registrant?: {
    companyName: string
  }
}
