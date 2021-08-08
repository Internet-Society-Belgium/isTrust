import { DNS } from './Status'

export interface Website {
  hostname: string
}

export interface WebsiteStatus {
  domain: string
  dns?: DNS
}
