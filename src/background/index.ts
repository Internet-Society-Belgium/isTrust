import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'

browser.runtime.onMessage.addListener(
  (res: Website, sender): Promise<WebsiteStatus> => {
    console.log(`${res.host}`)
    return Promise.resolve({ data: 'background => content_script' })
  }
)
