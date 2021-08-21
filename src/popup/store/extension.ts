import { browser } from 'webextension-polyfill-ts'

export default {
  version: browser.runtime.getManifest().version,
  i18n(message: string) {
    return browser.i18n.getMessage(message)
  },
}
