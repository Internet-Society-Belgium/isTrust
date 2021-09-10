import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { LocalStorageExtension } from '../../types/localstorage'
import {
    StoreExtension,
    StoreExtensionConstants,
    StoreExtensionMethods,
    StoreExtensionStates,
} from '../types/store/extension'

const extensionConstants: StoreExtensionConstants = {
    version: browser.runtime.getManifest().version,
}

const extensionStates: StoreExtensionStates = reactive({
    chapter: {
        url: '',
    },
})

const extensionMethods: StoreExtensionMethods = {
    i18n(message: string): string {
        return browser.i18n.getMessage(message)
    },
}

const extension: StoreExtension = {
    constants: extensionConstants,
    states: readonly(extensionStates),
    methods: extensionMethods,
}

export default extension

async function getChapterUrl() {
    const storage = await browser.storage.local.get('extension')
    if (!storage.extension) return
    const extension: LocalStorageExtension = storage.extension
    extensionStates.chapter.url = extension.chapter.url
}

getChapterUrl()
