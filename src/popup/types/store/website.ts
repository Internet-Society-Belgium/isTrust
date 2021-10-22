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
}

export interface StoreWebsiteMethods {
    reload: () => Promise<void>
    goToHttps: () => Promise<void>
}

export const StoreWebsiteKey: InjectionKey<StoreWebsite> = Symbol('website')
