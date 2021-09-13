/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

export interface StoreSettings {
    states: StoreSettingsStates
    methods: StoreSettingsMethods
}

export interface StoreSettingsStates {
    dark: boolean
    reportBugs: boolean
}

export interface StoreSettingsMethods {
    toggleDark: () => Promise<void>
}

export const StoreSettingsKey: InjectionKey<StoreSettings> = Symbol('settings')
