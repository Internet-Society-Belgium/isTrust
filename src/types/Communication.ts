import { Dns } from './Dns'

export interface WebsiteInfo {
  url: string
}

export interface WebsiteData {
  secure: boolean
  domain: string
  dns?: Dns
}
