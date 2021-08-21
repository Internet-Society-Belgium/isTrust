import axios from 'axios'
import { reactive, readonly } from 'vue'
import { browser } from 'webextension-polyfill-ts'
import { WebsiteData } from '../../types/Communication'
import { Cookie } from '../../types/Cookie'
import chapters from '../data/chapters'
import { IpApi } from '../types/IpApi'

const websiteStates = reactive({
  internal: false,
  chapterUrl: '',
  data: {} as WebsiteData,
})
const websiteMethods = {
  async refresh() {
    websiteStates.data = {} as WebsiteData

    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    if (!tab) return
    const id = tab[0].id
    const url = tab[0].url
    if (!id || !url) return
    const { origin } = new URL(url)
    if (!origin) return

    await browser.cookies.remove({
      url: `${origin}/trest`,
      name: 'trest',
    })

    await getData()
  },
}

export default {
  states: readonly(websiteStates),
  methods: websiteMethods,
}

async function getData() {
  const tab = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab) return
  const id = tab[0].id
  const url = tab[0].url
  if (!id || !url) return
  const { protocol, origin } = new URL(url)
  if (!protocol || !origin) return

  if (!['http:', 'https:'].includes(protocol)) {
    websiteStates.internal = true
    return
  }

  let cookie = await browser.cookies.get({
    url: `${origin}/trest`,
    name: 'trest',
  })

  let cookieData: Cookie | undefined

  if (cookie) {
    cookieData = JSON.parse(cookie.value)
  }

  const extensionVersion = await browser.runtime.getManifest().version

  if (!cookieData || cookieData.version !== extensionVersion) {
    await browser.tabs.sendMessage(id, {})
    cookie = await browser.cookies.get({
      url: `${origin}/trest`,
      name: 'trest',
    })
  }

  if (cookie) {
    websiteStates.data = JSON.parse(cookie.value)
  }
}

async function getChapterUrl() {
  const { data } = await axios.get<IpApi>(
    `http://ip-api.com/json/?fields=countryCode`
  )

  let chapter

  if (data?.countryCode) {
    chapter = chapters.find((c) => c.country === data.countryCode)
  }

  websiteStates.chapterUrl = (chapter || chapters[0]).url
}

getData()
getChapterUrl()
