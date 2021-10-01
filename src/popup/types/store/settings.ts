/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

export interface StoreSettings {
    states: StoreSettingsStates
    transitioning: StoreSettingsTransitiongStates
    methods: StoreSettingsMethods
}

export interface StoreSettingsStates {
    dark: boolean
}

export interface StoreSettingsTransitiongStates {
    dark: boolean
}

export interface StoreSettingsMethods {
    toggleDark: () => Promise<void>
}

export const StoreSettingsKey: InjectionKey<StoreSettings> = Symbol('settings')
