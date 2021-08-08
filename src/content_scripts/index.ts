import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'
import { Cookie } from '../types/Cookie'

const getCookie = (name: string): string | undefined => {
  let key = name + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let cookies = decodedCookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(key) == 0) {
      return cookie.substring(key.length, cookie.length)
    }
  }
  return
}

const setCookie = (name: string, value: string) => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};Path=/;Expires=${d.toUTCString()};Secure;SameSite=Strict;`
}

browser.runtime.onMessage.addListener(async () => {
  let cookie = {} as Cookie

  let cookieString = getCookie('trest')
  if (cookieString) {
    cookie = JSON.parse(cookieString)
  }

  const extensionVersion = browser.runtime.getManifest().version

  if (!cookie || cookie.version !== extensionVersion) {
    const website: Website = {
      hostname: location.hostname,
    }
    const status: WebsiteStatus = await browser.runtime.sendMessage(website)
    const newCookie: Cookie = {
      version: extensionVersion,
      ...status,
    }

    setCookie('trest', JSON.stringify(newCookie))
  }
})
