import { DNS } from './Status'

export interface Website {
  hostname: string
}

export interface WebsiteData {
  domain: string
  dns?: DNS
}
