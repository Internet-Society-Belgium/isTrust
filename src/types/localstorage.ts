import { StoreExtensionStates } from '../popup/types/store/extension'
import { StoreSettingsStates } from '../popup/types/store/settings'

export interface LocalStorage {
    extension?: LocalStorageExtension
    settings?: LocalStorageSettings
}

export type LocalStorageExtension = StoreExtensionStates
export type LocalStorageSettings = StoreSettingsStates
