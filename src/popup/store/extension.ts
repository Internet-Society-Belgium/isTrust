import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import {
    StoreExtension,
    StoreExtensionConstants,
    StoreExtensionMethods,
    StoreExtensionStates,
} from '../types/store/extension'

import storage from '../../utils/localstorage'

const extensionConstants: StoreExtensionConstants = {
    version: browser.runtime.getManifest().version,
}

const extensionStates: StoreExtensionStates = reactive({
    chapterUrl: 'https://www.istrust.org/',
})

const extensionMethods: StoreExtensionMethods = {
    i18n(message: string, placeholders?: string | string[]): string {
        return browser.i18n.getMessage(message, placeholders)
    },
}

const extension: StoreExtension = {
    constants: extensionConstants,
    states: readonly(extensionStates),
    methods: extensionMethods,
}

export default extension

async function loadStorage() {
    let extension = await storage.extension.get()
    while (!extension || !extension.chapterUrl) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        extension = await storage.extension.get()
    }

    extensionStates.chapterUrl = extension.chapterUrl
}

;(async () => {
    await loadStorage()
})()
