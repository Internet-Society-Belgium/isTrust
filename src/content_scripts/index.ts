import { browser } from 'webextension-polyfill-ts'
import { Website, WebsiteStatus } from '../types/Communication'

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
  let expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + ';' + expires + ';path=/'
}

async function main() {
  let cookie = getCookie('trest')
  if (!cookie) {
    const website: Website = { host: location.hostname }
    const res: WebsiteStatus = await browser.runtime.sendMessage(website)
    cookie = JSON.stringify(res)
    setCookie('trest', cookie)
  }
  console.log(JSON.parse(cookie))
}

main()
