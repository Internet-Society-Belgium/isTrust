import { Certificate } from './certificate'
import { Dns } from './dns'
import { WebsiteScore } from './score'

export interface WebsiteData {
    url: WebsiteDataUrl
    scores: WebsiteScore
    certificate?: Certificate
    dns?: Dns
}

export interface WebsiteDataUrl {
    https: boolean
    subdomain: string | null
    domain: string
}
