import axios from 'axios'
import browser from 'webextension-polyfill'

import { LocalStorageSettings } from '../../types/localstorage'
import { Bug } from '../types/bug'

export default async function reportBug({ type, data }: Bug): Promise<void> {
    const storage = await browser.storage.local.get('settings')
    if (!storage.settings) return
    const settings: LocalStorageSettings = storage.settings
    if (!settings.reportBugs) return

    axios.post(`https://istrust.api.progiciel.be/bugs`, {
        type,
        data,
    })
}
