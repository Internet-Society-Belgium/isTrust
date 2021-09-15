/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

import { WebsiteData } from '../../../types/communication'

export interface StoreWebsite {
    states: StoreWebsiteStates
    methods: StoreWebsiteMethods
}

export interface StoreWebsiteStates {
    internal: boolean
    loading: boolean
    data?: WebsiteData
    scores?: StoreWebsiteScore
}

export interface StoreWebsiteScore {
    score: Score
    domain: StoreWebsiteScoreDomain
    security: StoreWebsiteScoreSecurity
}

export interface StoreWebsiteScoreDomain {
    score: Score
    registration: Score
    lastChanged: Score
    registrant: Score
}

export interface StoreWebsiteScoreSecurity {
    score: Score
    https: Score
    certificate: Score
}

type Score = 'ok' | 'neutral' | 'warning'

export interface StoreWebsiteMethods {
    reload: () => Promise<void>
    goToHttps: () => Promise<void>
}

export const StoreWebsiteKey: InjectionKey<StoreWebsite> = Symbol('website')
