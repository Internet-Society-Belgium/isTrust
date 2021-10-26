import { Certificate } from '../../types/certificate'
import { WebsiteDataUrl } from '../../types/communication'
import { Dns } from '../../types/dns'
import {
    WebsiteScore,
    WebsiteScoreDomain,
    WebsiteScoreCommunication,
} from '../../types/score'

export function getScores({
    url,
    dns,
    certificate,
}: {
    url: WebsiteDataUrl
    dns?: Dns
    certificate?: Certificate
}): WebsiteScore {
    const scoresDomain = getDomainScores({ dns })
    const scoresCommunication = getCommunicationScores({ url, certificate })

    const scores: WebsiteScore = {
        score: 'neutral',
        domain: scoresDomain,
        communication: scoresCommunication,
    }

    for (const [k, v] of Object.entries(scores)) {
        if (k === 'score') continue
        const vScore = v.score
        if (!vScore) continue
        if (vScore === 'warning') scores.score = 'warning'
        if (vScore === 'ok' && scores.score === 'neutral') scores.score = 'ok'
    }

    return scores
}

function getDomainScores({ dns }: { dns?: Dns }): WebsiteScoreDomain {
    const scores: WebsiteScoreDomain = {
        score: 'neutral',
        registration: 'neutral',
        transfer: 'neutral',
        lastChanged: 'neutral',
        registrant: 'neutral',
    }

    if (dns?.events?.registration) {
        const registration = new Date(dns?.events.registration)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 6)

        if (recent < registration) {
            scores.registration = 'warning'
        } else {
            scores.registration = 'ok'
        }
    }

    if (dns?.events?.transfer) {
        const transfer = new Date(dns?.events.transfer)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 1)

        if (recent < transfer) {
            scores.transfer = 'warning'
        } else {
            scores.transfer = 'ok'
        }
    }

    if (dns?.events?.lastChanged) {
        const lastChanged = new Date(dns?.events.lastChanged)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 1)

        if (recent < lastChanged) {
            scores.lastChanged = 'warning'
        } else {
            scores.lastChanged = 'ok'
        }
    }

    if (dns) {
        if (!dns?.registrant) {
            scores.registrant = 'warning'
        } else {
            scores.registrant = 'ok'
        }
    }

    for (const [k, v] of Object.entries(scores)) {
        if (k === 'score') continue
        if (v === 'warning') scores.score = 'warning'
        if (v === 'ok' && scores.score === 'neutral') scores.score = 'ok'
    }

    return scores
}

function getCommunicationScores({
    url,
    certificate,
}: {
    url?: WebsiteDataUrl
    certificate?: Certificate
}): WebsiteScoreCommunication {
    const scores: WebsiteScoreCommunication = {
        score: 'neutral',
        https: 'neutral',
        certificate: 'neutral',
    }

    if (url) {
        if (!url.https) {
            scores.https = 'warning'
        } else {
            scores.https = 'ok'
        }
    }

    if (certificate) {
        if (!certificate.valid) {
            scores.certificate = 'warning'
        } else {
            scores.certificate = 'ok'
        }
    }

    for (const [k, v] of Object.entries(scores)) {
        if (k === 'score') continue
        if (v === 'warning') scores.score = 'warning'
        if (v === 'ok' && scores.score === 'neutral') scores.score = 'ok'
    }

    return scores
}
