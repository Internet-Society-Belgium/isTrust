import { reactive, readonly } from 'vue'
import browser from 'webextension-polyfill'

const settingsStates = reactive({
    dev: false,
})

const settingsMethods = {
    async toggleDev(): Promise<void> {
        settingsStates.dev = !settingsStates.dev
        await browser.storage.local.set({ settings: settingsStates })
    },
}

export default {
    states: readonly(settingsStates),
    methods: settingsMethods,
}

async function loadLocalStorage() {
    const { settings } = await browser.storage.local.get('settings')

    if (settings) {
        settingsStates.dev = settings.dev
    } else {
        await browser.storage.local.set({ settings: settingsStates })
    }
}

loadLocalStorage()
