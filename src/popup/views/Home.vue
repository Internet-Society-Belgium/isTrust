<template>
  <div class="home">
    <h1>{{ websiteStatus.hostname }}</h1>
    <div>{{ JSON.stringify(websiteStatus, null, 2) }}</div>
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
          const url = tab[0].url
          if (url) {
            const cookie = await browser.cookies.get({
              url,
              name: 'trest',
            })
            this.websiteStatus = {
              hostname: new URL(url).hostname,
              ...JSON.parse(cookie.value),
            }
          }
        }
      },
    },
  })
</script>
