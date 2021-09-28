import browser from 'webextension-polyfill'

export function formatDate(date: string | Date): string {
    const lang = browser.i18n.getUILanguage()
    return new Date(date).toLocaleString(lang || 'en-GB', {
        dateStyle: 'long',
    })
}
