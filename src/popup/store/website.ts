import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { WebsiteData } from '../../types/communication'
import { Cookie } from '../../types/cookie'
import {
    StoreWebsite,
    StoreWebsiteMethods,
    StoreWebsiteStates,
} from '../types/store/website'

const websiteStates: StoreWebsiteStates = reactive({
    internal: false,
    loading: false,
})

const websiteMethods: StoreWebsiteMethods = {
    async clear(): Promise<void> {
        websiteStates.data = {} as WebsiteData
        websiteStates.score = undefined

        const tab = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
        if (!tab) return
        const id = tab[0].id
        const url = tab[0].url
        if (!id || !url) return
        const { protocol, origin } = new URL(url)
        if (!origin) return

        await browser.cookies.remove({
            url: `${origin}/trest`,
            name: `${protocol}trest`,
        })

        await init()
    },
}

const website: StoreWebsite = {
    states: readonly(websiteStates),
    methods: websiteMethods,
}

export default website

async function init() {
    await fetchData()
    calculateScore()
}

async function fetchData() {
    const tab = await browser.tabs.query({
        active: true,
        currentWindow: true,
    })
    if (!tab) return

    while (tab[0].status === 'loading') {
        await new Promise((resolve) => setTimeout(resolve, 500))
    }

    const id = tab[0].id
    const url = tab[0].url
    if (!id || !url) return
    const { protocol, origin } = new URL(url)
    if (!protocol || !origin) return

    if (!['http:', 'https:'].includes(protocol)) {
        websiteStates.internal = true
        websiteStates.loading = false
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
        websiteStates.loading = true

        await browser.tabs.sendMessage(id, {})

        cookie = await browser.cookies.get({
            url: `${origin}/trest`,
            name: `${protocol}trest`,
        })
    }

    if (cookie) {
        websiteStates.data = JSON.parse(cookie.value)
        websiteStates.loading = false
    }
}

function calculateScore() {
    if (websiteStates.internal) return

    websiteStates.score = {
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

    calculateDomainScore()
    calculateSecurityScore()
}

function calculateDomainScore() {
    const data = websiteStates.data
    if (!data) return
    const score = websiteStates.score
    if (!score) return

    if (data.dns?.events.registration) {
        const registration = new Date(data.dns?.events.registration)
        const recent = new Date()
        recent.setFullYear(recent.getFullYear() - 1)

        if (recent < registration) {
            score.domain.registration = 'warning'
        } else {
            score.domain.registration = 'ok'
        }
    }

    if (data.dns?.events.lastChanged) {
        const lastChanged = new Date(data.dns?.events.lastChanged)
        const recent = new Date()
        recent.setMonth(recent.getMonth() - 6)

        if (recent < lastChanged) {
            score.domain.lastChanged = 'warning'
        } else {
            score.domain.lastChanged = 'ok'
        }
    }

    if (data.dns) {
        if (!data.dns?.registrant) {
            score.domain.registrant = 'warning'
        } else {
            score.domain.registrant = 'ok'
        }
    }

    for (const [k, v] of Object.entries(score.domain)) {
        if (k === 'score') continue
        if (v === 'warning') score.domain.score = 'warning'
        if (v === 'ok' && score.domain.score === 'neutral')
            score.domain.score = 'ok'
    }
}

function calculateSecurityScore() {
    const data = websiteStates.data
    if (!data) return
    const score = websiteStates.score
    if (!score) return

    if (!data.https) {
        score.security.https = 'warning'
    } else {
        score.security.https = 'ok'
    }

    if (data.certificate) {
        if (!data.certificate.valid) {
            score.security.certificate = 'warning'
        } else {
            score.security.certificate = 'ok'
        }
    }

    for (const [k, v] of Object.entries(score.security)) {
        if (k === 'score') continue
        if (v === 'warning') score.security.score = 'warning'
        if (v === 'ok' && score.security.score === 'neutral')
            score.security.score = 'ok'
    }
}

;(async () => {
    await init()
})()
