<template>
  <div class="home">
    <h1>{{ internal ? i18n('internal') : data.domain }}</h1>
    <div v-if="!internal">
      {{ JSON.stringify(data, null, 2) }}
    </div>
    <div>{{ chapterUrl }}</div>
    <button v-on:click="deleteCookie">refresh</button>
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { defineComponent } from 'vue'
  import { browser } from 'webextension-polyfill-ts'
  import { WebsiteData } from '../../types/Communication'
  import { Cookie } from '../../types/Cookie'
  import { IpApi } from '../../types/api/IpApi'
  import chapters from '../data/chapters'

  export default defineComponent({
    name: 'Home',
    data() {
      return {
        internal: false,
        chapterUrl: '',
        data: {} as WebsiteData,
      }
    },
    created() {
      // this.getChapterUrl()
      this.getWebsiteStatus()
    },
    methods: {
      async getChapterUrl() {
        const { data } = await axios.get<IpApi>(
          `http://ip-api.com/json/?fields=countryCode`
        )

        let chapter

        if (data?.countryCode) {
          chapter = chapters.find((c) => c.country === data.countryCode)
        }

        this.chapterUrl = (chapter || chapters[0]).url
      },
      async getWebsiteStatus() {
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
          this.internal = true
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
          this.data = JSON.parse(cookie.value)
        }
      },
      async deleteCookie() {
        this.data = {} as WebsiteData

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

        this.getWebsiteStatus()
      },
      i18n(message: string) {
        return browser.i18n.getMessage(message)
      },
    },
  })
</script>

<style lang="scss"></style>
