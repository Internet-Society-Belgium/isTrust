export interface WebsiteScore {
    score: Score
    domain: WebsiteScoreDomain
    security: WebsiteScoreSecurity
}

export interface WebsiteScoreDomain {
    score: Score
    registration: Score
    transfer: Score
    lastChanged: Score
    registrant: Score
}

export interface WebsiteScoreSecurity {
    score: Score
    https: Score
    certificate: Score
}

export type Score = 'ok' | 'neutral' | 'warning'
