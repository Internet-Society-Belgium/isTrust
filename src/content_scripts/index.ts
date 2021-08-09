import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteData } from '../types/Communication'
import { Cookie } from '../types/Cookie'

const setCookie = (value: string) => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  document.cookie = `trest=${value};Path=/trest;Expires=${d.toUTCString()};Secure;SameSite=Strict;`
}

browser.runtime.onMessage.addListener(async () => {
  const extensionVersion = browser.runtime.getManifest().version
  const website: Website = {
    hostname: location.hostname,
  }
  const status: WebsiteData = await browser.runtime.sendMessage(website)
  const newCookie: Cookie = {
    version: extensionVersion,
    ...status,
  }
  setCookie(JSON.stringify(newCookie))
})
