export interface WebsiteScore {
    score: Score
    domain: WebsiteScoreDomain
    communication: WebsiteScoreCommunication
}

export interface WebsiteScoreDomain {
    score: Score
    registration: Score
    lastChanged: Score
    registrant: Score
}

export interface WebsiteScoreCommunication {
    score: Score
    https: Score
    certificate: Score
}

export type Score = 'ok' | 'neutral' | 'warning'
