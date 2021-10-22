import browser from 'webextension-polyfill'

;(async () => {
    await browser.runtime.sendMessage({
        cacheOnly: true,
    })
})()
