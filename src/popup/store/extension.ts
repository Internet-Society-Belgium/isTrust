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
    chapter: {
        url: '',
    },
})

const extensionMethods: StoreExtensionMethods = {
    i18n(message: string, placeholders: string | string[]): string {
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
    const extension = await storage.extension.get()
    if (!extension) {
        await updateStorage()
    } else {
        extensionStates.chapter.url = extension.chapter.url
    }
}

async function updateStorage() {
    await storage.extension.set(Object.assign({}, extensionStates))
}

;(async () => {
    await loadStorage()
})()
