import { Certificate } from './certificate'
import { Dns } from './dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    hostname: string
    https: boolean
    certificate?: Certificate
    dns?: Dns
}
