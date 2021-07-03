import { browser } from 'webextension-polyfill-ts'
import { CommunicationData } from '../types/Communication'

browser.runtime.onMessage.addListener(
  (msg: string, sender): Promise<CommunicationData> => {
    console.log(`${JSON.stringify(msg)}`)
    return Promise.resolve({ data: 'background => content_script' })
  }
)
