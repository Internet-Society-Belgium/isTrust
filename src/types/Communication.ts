import { DNS } from './Status'

export interface Website {
  hostname: string
}

export interface WebsiteStatus {
  internal: boolean
  domain?: string
  dns?: DNS
}
