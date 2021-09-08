import { Certificate } from './certificate'
import { Dns } from './dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    domain: string
    https: boolean
    certificate?: Certificate
    dns?: Dns
}
