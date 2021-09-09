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
    const localStorage = await browser.storage.local.get('extension')
    if (!localStorage.extension) return
    const extension: LocalStorageExtension = localStorage.extension
    extensionStates.chapter.url = extension.chapter.url
}

getChapterUrl()
