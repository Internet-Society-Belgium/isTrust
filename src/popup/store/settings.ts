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
        settingsStates.dev = !settingsStates.dev
        const localStorage: LocalStorage = { settings: settingsStates }
        await browser.storage.local.set(localStorage)
    },
}

const settings: StoreSettings = {
    states: readonly(settingsStates),
    methods: settingsMethods,
}

export default settings

async function loadLocalStorage() {
    const localStorage = await browser.storage.local.get('settings')
    if (!localStorage.settings) return
    const settings: LocalStorageSettings = localStorage.settings

    if (settings) {
        settingsStates.dev = settings.dev
    } else {
        const localStorage: LocalStorage = { settings: settingsStates }
        await browser.storage.local.set(localStorage)
    }
}

loadLocalStorage()
