import { browser } from 'webextension-polyfill-ts'
import { WebsiteInfo, WebsiteData } from '../types/Communication'
import { Cookie } from '../types/Cookie'

const setCookie = (value: string) => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  document.cookie = `trest=${value};Path=/trest;Expires=${d.toUTCString()};SameSite=Strict;`
}

browser.runtime.onMessage.addListener(async () => {
  const extensionVersion = browser.runtime.getManifest().version
  const website: WebsiteInfo = {
    hostname: location.hostname,
  }
  const data: WebsiteData = await browser.runtime.sendMessage(website)
  const newCookie: Cookie = {
    version: extensionVersion,
    ...data,
  }
  setCookie(JSON.stringify(newCookie))
})
