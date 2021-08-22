import axios from 'axios'
import { reactive, readonly } from 'vue'
import { browser } from 'webextension-polyfill-ts'
import chapters from '../data/chapters'
import { IpApi } from '../types/IpApi'

const extensionStates = reactive({
  chapter: {
    url: '',
  },
})

export default {
  version: browser.runtime.getManifest().version,
  i18n(message: string) {
    return browser.i18n.getMessage(message)
  },
  states: readonly(extensionStates),
}

async function getChapterUrl() {
  const { extension } = await browser.storage.local.get('extension')
  if (extension) {
    extensionStates.chapter.url = extension.chapter.url
  } else {
    const { data } = await axios.get<IpApi>(
      `http://ip-api.com/json/?fields=countryCode`
    )

    let chapter

    if (data?.countryCode) {
      chapter = chapters.find((c) => c.country === data.countryCode)
    }

    extensionStates.chapter.url = (chapter || chapters[0]).url

    await browser.storage.local.set({ extension: extensionStates })
  }
}

getChapterUrl()
