import browser from 'webextension-polyfill'

import { WebsiteInfo, WebsiteData } from '../types/communication'
import { Cookie } from '../types/cookie'

const setCookie = (value: string, secure: boolean) => {
    const d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
    document.cookie = `${
        secure ? 'https:trest' : 'http:trest'
    }=${value};Path=/trest;Expires=${d.toUTCString()};SameSite=Strict;`
}

browser.runtime.onMessage.addListener(async () => {
    const extensionVersion = browser.runtime.getManifest().version
    const website: WebsiteInfo = {
        url: location.href,
    }
    const data: WebsiteData = await browser.runtime.sendMessage(website)
    const newCookie: Cookie = {
        version: extensionVersion,
        ...data,
    }
    setCookie(JSON.stringify(newCookie), data.https)
})
