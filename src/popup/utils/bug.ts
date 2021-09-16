import axios from 'axios'

import { Bug } from '../types/bug'

import storage from '../../utils/localstorage'

export default async function reportBug({ type, data }: Bug): Promise<void> {
    console.error(`${type} ${JSON.stringify(data)}`)

    const settings = await storage.settings.get()
    if (!settings?.reportBugs) return

    await axios.post(`https://istrust.api.progiciel.be/bugs`, {
        type,
        data,
    })
}
