import { StoreExtensionStates } from '../popup/types/store/extension'
import { StoreSettingsStates } from '../popup/types/store/settings'
import { WebsiteData } from './communication'

export type LocalStorageExtension = StoreExtensionStates
export type LocalStorageSettings = StoreSettingsStates
export interface LocalStorageCache {
    [key: string]: {
        created: string
        data: LocalStorageCacheData
    }
}
export type LocalStorageCacheData = WebsiteData
