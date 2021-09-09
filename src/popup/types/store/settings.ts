/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

export interface StoreSettings {
    states: StoreSettingsStates
    methods: StoreSettingsMethods
}

export interface StoreSettingsStates {
    dev: boolean
}

export interface StoreSettingsMethods {
    toggleDev: () => Promise<void>
}

export const StoreSettingsKey: InjectionKey<StoreSettings> = Symbol('settings')
