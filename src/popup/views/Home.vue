<template>
  <div class="home">
    <h1>{{ internal ? 'Internal' : data.domain }}</h1>
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

          if (id && url) {
            if (!/https?:\/\/.*/.test(url)) {
              this.internal = true
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
              this.data = {
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
