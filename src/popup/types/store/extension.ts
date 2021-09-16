/* eslint-disable no-unused-vars */
import { InjectionKey } from 'vue'

export interface StoreExtension {
    constants: StoreExtensionConstants
    states: StoreExtensionStates
    methods: StoreExtensionMethods
}

export interface StoreExtensionConstants {
    version: string
}

export interface StoreExtensionStates {
    chapter: {
        url: string
    }
}

export interface StoreExtensionMethods {
    i18n: (message: string, placeholders: string | string[]) => string
}

export const StoreExtensionKey: InjectionKey<StoreExtension> =
    Symbol('extension')
