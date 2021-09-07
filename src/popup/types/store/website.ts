/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

import { WebsiteData } from '../../../types/Communication'

export interface StoreWebsite {
    states: StoreWebsiteStates
    methods: StoreWebsiteMethods
}

export interface StoreWebsiteStates {
    internal: boolean
    loading: boolean
    data: WebsiteData
}

export interface StoreWebsiteMethods {
    refresh: (cookie: boolean) => Promise<void>
}

export const StoreWebsiteKey: InjectionKey<StoreWebsite> = Symbol('website')
