import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

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
        await browser.storage.local.set({ settings: settingsStates })
    },
}

const settings: StoreSettings = {
    states: readonly(settingsStates),
    methods: settingsMethods,
}

export default settings

async function loadLocalStorage() {
    const { settings } = await browser.storage.local.get('settings')

    if (settings) {
        settingsStates.dev = settings.dev
    } else {
        await browser.storage.local.set({ settings: settingsStates })
    }
}

loadLocalStorage()
