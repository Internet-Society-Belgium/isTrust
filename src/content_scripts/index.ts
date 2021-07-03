import { browser } from 'webextension-polyfill-ts'
import { CommunicationData } from '../types/Communication'

async function sendMessage() {
  const response: CommunicationData = await browser.runtime.sendMessage({
    data: 'content_script => background',
  })

  console.log(`content_script response: ${JSON.stringify(response)}`)
}

sendMessage()
