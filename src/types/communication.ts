import { Certificate } from './certificate'
import { Dns } from './dns'
import { WebsiteScore } from './score'

export interface WebsiteData {
    url: WebsiteDataUrl
    scores: WebsiteScore
    dns?: Dns
    certificate?: Certificate
}

export interface WebsiteDataUrl {
    https: boolean
    subdomain: string | null
    domain: string
}
