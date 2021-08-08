<template>
  <div class="home">
    <h1>{{ websiteStatus.internal ? 'Internal' : websiteStatus.domain }}</h1>
    <div v-if="!websiteStatus.internal">
      {{ JSON.stringify(websiteStatus, null, 2) }}
    </div>
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { browser } from 'webextension-polyfill-ts'
  import { WebsiteStatus } from '../../types/Communication'

  export default defineComponent({
    name: 'Home',
    data() {
      return {
        websiteStatus: {} as WebsiteStatus,
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

          if (id && url) {
            if (!/https?:\/\/.*/.test(url)) {
              this.websiteStatus = {
                internal: true,
              }
            }
            let cookie = await browser.cookies.get({
              url,
              name: 'trest',
            })

            if (!cookie) {
              await browser.tabs.sendMessage(id, {})
              cookie = await browser.cookies.get({
                url,
                name: 'trest',
              })
            }

            if (cookie) {
              this.websiteStatus = {
                ...JSON.parse(cookie.value),
              }
            }
          }
        }
      },
    },
  })
</script>

<style lang="scss"></style>
