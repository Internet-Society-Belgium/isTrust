<template>
  <div class="home">
    <h1>{{ internal ? i18n('internal') : data.domain }}</h1>
    <div v-if="!internal">
      {{ JSON.stringify(data, null, 2) }}
    </div>
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { browser } from 'webextension-polyfill-ts'
  import { WebsiteData } from '../../types/Communication'
  import { Cookie } from '../../types/Cookie'

  export default defineComponent({
    name: 'Home',
    data() {
      return {
        internal: false,
        data: {} as WebsiteData,
      }
    },
    created() {
      this.getWebsiteStatus()
    },
    methods: {
      async getWebsiteStatus() {
        const tab = await browser.tabs.query({
          active: true,
          currentWindow: true,
        })
        if (tab) {
          const id = tab[0].id
          const url = tab[0].url
          if (!id || !url) return

          if (!/https?:\/\/.*/.test(url)) {
            this.internal = true
          }

          let cookie = await browser.cookies.get({
            url: `${url}${url.endsWith('/') ? '' : '/'}trest`,
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
              url: `${url}${url.endsWith('/') ? '' : '/'}trest`,
              name: 'trest',
            })
          }

          if (cookie) {
            this.data = JSON.parse(cookie.value)
          }
        }
      },
    i18n(message: string) {
      return browser.i18n.getMessage(message)
    },
    },
  })
</script>

<style lang="scss"></style>
