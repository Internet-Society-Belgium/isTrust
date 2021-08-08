export interface DNS {
  country: string | null
  domainInfo?: {
    updated: string
  }
  registrant?: {
    companyName: string
  }
}
