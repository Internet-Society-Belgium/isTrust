import { reactive, readonly } from 'vue'

import {
    StoreSettings,
    StoreSettingsMethods,
    StoreSettingsStates,
} from '../types/store/settings'

import storage from '../../utils/localstorage'

const settingsStates: StoreSettingsStates = reactive({
    dark: false,
    reportBugs: true,
})

const settingsMethods: StoreSettingsMethods = {
    async toggleDark(): Promise<void> {
        settingsStates.dark = !settingsStates.dark
        await updateStorage()
    },
    async toggleReportBugs(): Promise<void> {
        settingsStates.reportBugs = !settingsStates.reportBugs
        await updateStorage()
    },
}

const settings: StoreSettings = {
    states: readonly(settingsStates),
    methods: settingsMethods,
}

export default settings

async function loadStorage() {
    const settings = await storage.settings.get()
    if (!settings) {
        await updateStorage()
    } else {
        settingsStates.dark = settings.dark
        settingsStates.reportBugs = settings.reportBugs
    }
}

async function updateStorage() {
    await storage.settings.set(Object.assign({}, settingsStates))
}

;(async () => {
    await loadStorage()
})()
