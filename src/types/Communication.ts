import { Dns } from '../background/types/Dns'

export interface WebsiteInfo {
    url: string
}

export interface WebsiteData {
    secure: boolean
    domain: string
    dns?: Dns
}
