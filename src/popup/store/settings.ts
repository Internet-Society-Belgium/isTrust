import { reactive, readonly } from 'vue'

import {
    StoreSettings,
    StoreSettingsMethods,
    StoreSettingsStates,
    StoreSettingsTransitiongStates,
} from '../types/store/settings'

import storage from '../../utils/localstorage'

const settingsStates: StoreSettingsStates = reactive({
    dark: false,
})

const settingsTransitiongStates: StoreSettingsTransitiongStates = reactive({
    dark: false,
})

const settingsMethods: StoreSettingsMethods = {
    async toggleDark(): Promise<void> {
        settingsTransitiongStates.dark = true
        setTimeout(() => (settingsTransitiongStates.dark = false), 600)
        settingsStates.dark = !settingsStates.dark
        await updateStorage()
    },
}

const settings: StoreSettings = {
    states: readonly(settingsStates),
    transitioning: readonly(settingsTransitiongStates),
    methods: settingsMethods,
}

export default settings

async function loadStorage() {
    const settings = await storage.settings.get()
    if (!settings) {
        await updateStorage()
    } else {
        settingsStates.dark = settings.dark
    }
}

async function updateStorage() {
    await storage.settings.set(Object.assign({}, settingsStates))
}

;(async () => {
    await loadStorage()
})()
