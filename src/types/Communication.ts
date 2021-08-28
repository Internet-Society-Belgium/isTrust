import { Certificate } from './Certificate'
import { Dns } from './Dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    domain: string
    secure: boolean
    certificate?: Certificate
    dns?: Dns
}
