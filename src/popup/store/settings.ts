import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { LocalStorage, LocalStorageSettings } from '../../types/localstorage'
import {
    StoreSettings,
    StoreSettingsMethods,
    StoreSettingsStates,
} from '../types/store/settings'

const settingsStates: StoreSettingsStates = reactive({
    dev: false,
})

const settingsMethods: StoreSettingsMethods = {
    async toggleDev(): Promise<void> {
        const storage: LocalStorage = { settings: settingsStates }
        await browser.storage.local.set(storage)
    },
}

const settings: StoreSettings = {
    states: readonly(settingsStates),
    methods: settingsMethods,
}

export default settings

async function loadLocalStorage() {
    const storage = await browser.storage.local.get('settings')
    if (!storage.settings) return
    const settings: LocalStorageSettings = storage.settings

    if (settings) {
        settingsStates.dev = settings.dev
    } else {
        const storage: LocalStorage = { settings: settingsStates }
        await browser.storage.local.set(storage)
    }
}

loadLocalStorage()
