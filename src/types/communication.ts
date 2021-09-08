import { Certificate } from './certificate'
import { Dns } from './dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    domain: string
    secure: boolean
    certificate?: Certificate
    dns?: Dns
}
