import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

import { LocalStorage, LocalStorageSettings } from '../../types/localstorage'
import {
    StoreSettings,
    StoreSettingsMethods,
    StoreSettingsStates,
} from '../types/store/settings'

const settingsStates: StoreSettingsStates = reactive({
    dark: false,
    reportBugs: true,
})

const settingsMethods: StoreSettingsMethods = {
    async toggleDark(): Promise<void> {
        settingsStates.dark = !settingsStates.dark
        const storage: LocalStorage = {
            settings: Object.assign({}, settingsStates),
        }
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
        settingsStates.dark = settings.dark
    } else {
        const storage: LocalStorage = { settings: settingsStates }
        await browser.storage.local.set(storage)
    }
}

loadLocalStorage()
