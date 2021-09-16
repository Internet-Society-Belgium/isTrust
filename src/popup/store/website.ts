import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { WebsiteData } from '../../types/communication'
import {
    StoreWebsite,
    StoreWebsiteMethods,
    StoreWebsiteScore,
    StoreWebsiteScoreDomain,
    StoreWebsiteScoreSecurity,
    StoreWebsiteStates,
} from '../types/store/website'

import storage from '../../utils/localstorage'

const websiteStates: StoreWebsiteStates = reactive({
    internal: false,
    loading: true,
})

const websiteMethods: StoreWebsiteMethods = {
    async reload(): Promise<void> {
        const tab = await getCurrentTab()
        if (!tab?.url) return
        const { origin } = new URL(tab.url)
        if (!origin) return
        await storage.cache.remove(origin)
        await browser.tabs.reload()
        await init()
    },
    async goToHttps(): Promise<void> {
        const tab = await getCurrentTab()
        if (!tab?.url) return
        await browser.tabs.update({
            url: tab.url.replace('http://', 'https://'),
        })
        website?.methods.reload()
    },
}

const website: StoreWebsite = {
    states: readonly(websiteStates),
    methods: websiteMethods,
}

export default website

async function init() {
    websiteStates.loading = true
    websiteStates.data = undefined
    websiteStates.scores = undefined

    websiteStates.data = await fetchData()
    if (!websiteStates.internal) {
        websiteStates.scores = calculateScores()
    }
    websiteStates.loading = false
}

async function getCurrentTab() {
    let tab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    })
    while (!tab || tab.length === 0 || tab[0].status === 'loading') {
        await new Promise((resolve) => setTimeout(resolve, 100))
        tab = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
    }

    return tab[0]
}

async function fetchData(): Promise<WebsiteData | undefined> {
    const tab = await getCurrentTab()
    if (!tab) return
    const id = tab.id
    if (!id) return
    const url = tab.url
    if (!url) {
        websiteStates.internal = true
        return
    }

    const { origin } = new URL(url)
    if (!origin) return

    const cachedData = await storage.cache.get(origin)
    if (cachedData) return cachedData

    const data: WebsiteData = await browser.runtime.sendMessage({ url })
    if (!data) return

    await storage.cache.set(origin, data)

    return data
}

function calculateScores(): StoreWebsiteScore | undefined {
    if (!websiteStates.data) return

    const scoresDomain = calculateDomainScores(websiteStates.data)
    const scoresSecurity = calculateSecurityScores(websiteStates.data)

    const scores: StoreWebsiteScore = {
        score: 'neutral',
        domain: scoresDomain,
        security: scoresSecurity,
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

function calculateDomainScores(data: WebsiteData): StoreWebsiteScoreDomain {
    const scores: StoreWebsiteScoreDomain = {
        score: 'neutral',
        registration: 'neutral',
        transfer: 'neutral',
        lastChanged: 'neutral',
        registrant: 'neutral',
    }

    if (data.dns?.events?.registration) {
        const registration = new Date(data.dns?.events.registration)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 6)

        if (recent < registration) {
            scores.registration = 'warning'
        } else {
            scores.registration = 'ok'
        }
    }

    if (data.dns?.events?.transfer) {
        const transfer = new Date(data.dns?.events.transfer)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 1)

        if (recent < transfer) {
            scores.transfer = 'warning'
        } else {
            scores.transfer = 'ok'
        }
    }

    if (data.dns?.events?.lastChanged) {
        const lastChanged = new Date(data.dns?.events.lastChanged)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 1)

        if (recent < lastChanged) {
            scores.lastChanged = 'warning'
        } else {
            scores.lastChanged = 'ok'
        }
    }

    if (data.dns) {
        if (!data.dns?.registrant) {
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

function calculateSecurityScores(data: WebsiteData): StoreWebsiteScoreSecurity {
    const scores: StoreWebsiteScoreSecurity = {
        score: 'neutral',
        https: 'neutral',
        certificate: 'neutral',
    }

    if (!data.url.https) {
        scores.https = 'warning'
    } else {
        scores.https = 'ok'
    }

    if (data.certificate) {
        if (!data.certificate.valid) {
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

;(async () => {
    await init()
})()
