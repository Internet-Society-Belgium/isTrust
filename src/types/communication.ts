import { Certificate } from './certificate'
import { Dns } from './dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    url: {
        https: boolean
        subdomain: string | null
        domain: string
    }
    certificate?: Certificate
    dns?: Dns
}
