import browser from 'webextension-polyfill'

import {
    LocalStorageCache,
    LocalStorageCacheData,
    LocalStorageExtension,
    LocalStorageSettings,
} from '../types/localstorage'

async function extensionGet(): Promise<LocalStorageExtension | undefined> {
    const storage = await browser.storage.local.get('extension')
    return storage?.extension
}

async function extensionSet(data: LocalStorageExtension): Promise<void> {
    const storage = extensionGet() || {}
    await browser.storage.local.set({ extension: { ...storage, ...data } })
}

async function extensionClear(): Promise<void> {
    await browser.storage.local.remove('extension')
}

async function settingsGet(): Promise<LocalStorageSettings | undefined> {
    const storage = await browser.storage.local.get('settings')
    return storage?.settings
}

async function settingsSet(data: LocalStorageSettings): Promise<void> {
    const storage = settingsGet() || {}
    await browser.storage.local.set({ settings: { ...storage, ...data } })
}

async function cacheGet(
    host: string
): Promise<LocalStorageCacheData | undefined> {
    const storage = await browser.storage.local.get('cache')
    if (!storage?.cache) return
    if (!storage.cache[host]) return
    return storage.cache[host].data
}

async function cacheSet(
    host: string,
    data: LocalStorageCacheData
): Promise<void> {
    const storage = await browser.storage.local.get('cache')
    const storageCache: LocalStorageCache = storage?.cache || {}
    storageCache[host] = { created: new Date().toISOString(), data }
    await browser.storage.local.set({ cache: storageCache })
}

async function cacheRemove(host: string): Promise<void> {
    const storage = await browser.storage.local.get('cache')
    const storageCache: LocalStorageCache = storage?.cache || {}
    delete storageCache[host]
    await browser.storage.local.set({ cache: storageCache })
}

async function cacheClear(): Promise<void> {
    await browser.storage.local.remove('cache')
}

async function cacheClearOutdated(): Promise<void> {
    const storage = await browser.storage.local.get('cache')
    if (!storage?.cache) return
    const cache: LocalStorageCache = storage.cache

    for (const [k, v] of Object.entries(cache)) {
        const created = new Date(v.created)
        const outdated = new Date()
        outdated.setDate(outdated.getDate() - 1)

        if (created < outdated) {
            delete cache[k]
        }
    }

    await browser.storage.local.set({ cache })
}

export default {
    extension: {
        get: extensionGet,
        set: extensionSet,
        clear: extensionClear,
    },
    settings: {
        get: settingsGet,
        set: settingsSet,
    },
    cache: {
        get: cacheGet,
        set: cacheSet,
        remove: cacheRemove,
        clear: cacheClear,
        clearOutdated: cacheClearOutdated,
    },
}
