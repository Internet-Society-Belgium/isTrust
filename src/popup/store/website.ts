import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { Cookie } from '../../types/cookie'
import {
    StoreWebsite,
    StoreWebsiteMethods,
    StoreWebsiteStates,
} from '../types/store/website'

const websiteStates: StoreWebsiteStates = reactive({
    internal: false,
    loading: true,
})

const websiteMethods: StoreWebsiteMethods = {
    async reload(): Promise<void> {
        await browser.tabs.reload()
        await init()
    },
}

const website: StoreWebsite = {
    states: readonly(websiteStates),
    methods: websiteMethods,
}

export default website

async function init() {
    websiteStates.loading = true
    await fetchData()
    if (!websiteStates.internal) {
        calculateScores()
    }
    websiteStates.loading = false
}

async function fetchData() {
    let tab: browser.Tabs.Tab[] | null = null
    do {
        if (tab) {
            await new Promise((resolve) => setTimeout(resolve, 500))
        }
        tab = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
        if (tab.length === 0) return
    } while (tab[0].status === 'loading')

    const id = tab[0].id
    const url = tab[0].url
    if (!id || !url) return
    const { protocol, origin } = new URL(url)
    if (!protocol || !origin) return

    if (!['http:', 'https:'].includes(protocol)) {
        websiteStates.internal = true
        return
    }

    let cookie = await browser.cookies.get({
        url: `${origin}/trest`,
        name: `${protocol}trest`,
    })

    let cookieData: Cookie | undefined

    if (cookie) {
        cookieData = JSON.parse(cookie.value)
    }

    const extensionVersion = await browser.runtime.getManifest().version

    if (!cookieData || cookieData.version !== extensionVersion) {
        try {
            await browser.tabs.sendMessage(id, {})
        } catch (e) {
            return
        }

        cookie = await browser.cookies.get({
            url: `${origin}/trest`,
            name: `${protocol}trest`,
        })
    }

    if (cookie) {
        websiteStates.data = JSON.parse(cookie.value)
    }
}

function calculateScores() {
    websiteStates.scores = {
        score: 'neutral',
        domain: {
            score: 'neutral',
            registration: 'neutral',
            lastChanged: 'neutral',
            registrant: 'neutral',
        },
        security: {
            score: 'neutral',
            https: 'neutral',
            certificate: 'neutral',
        },
    }

    calculateDomainScores()
    calculateSecurityScores()

    for (const [k, v] of Object.entries(websiteStates.scores)) {
        if (k === 'score') continue
        const vScore = v.score
        if (!vScore) continue
        if (vScore === 'warning') websiteStates.scores.score = 'warning'
        if (vScore === 'ok' && websiteStates.scores.score === 'neutral')
            websiteStates.scores.score = 'ok'
    }
}

function calculateDomainScores() {
    const data = websiteStates.data
    if (!data) return
    const scores = websiteStates.scores
    if (!scores) return

    if (data.dns?.events.registration) {
        const registration = new Date(data.dns?.events.registration)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 6)

        if (recent < registration) {
            scores.domain.registration = 'warning'
        } else {
            scores.domain.registration = 'ok'
        }
    }

    if (data.dns?.events.lastChanged) {
        const lastChanged = new Date(data.dns?.events.lastChanged)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 1)

        if (recent < lastChanged) {
            scores.domain.lastChanged = 'warning'
        } else {
            scores.domain.lastChanged = 'ok'
        }
    }

    if (data.dns) {
        if (!data.dns?.registrant) {
            scores.domain.registrant = 'warning'
        } else {
            scores.domain.registrant = 'ok'
        }
    }

    for (const [k, v] of Object.entries(scores.domain)) {
        if (k === 'score') continue
        if (v === 'warning') scores.domain.score = 'warning'
        if (v === 'ok' && scores.domain.score === 'neutral')
            scores.domain.score = 'ok'
    }
}

function calculateSecurityScores() {
    const data = websiteStates.data
    if (!data) return
    const scores = websiteStates.scores
    if (!scores) return

    if (!data.url.https) {
        scores.security.https = 'warning'
    } else {
        scores.security.https = 'ok'
    }

    if (data.certificate) {
        if (!data.certificate.valid) {
            scores.security.certificate = 'warning'
        } else {
            scores.security.certificate = 'ok'
        }
    }

    for (const [k, v] of Object.entries(scores.security)) {
        if (k === 'score') continue
        if (v === 'warning') scores.security.score = 'warning'
        if (v === 'ok' && scores.security.score === 'neutral')
            scores.security.score = 'ok'
    }
}

;(async () => {
    await init()
})()
