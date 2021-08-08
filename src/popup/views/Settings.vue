<template>
  <div class="settings">
    <h1>Settings</h1>
    <div>{{ `v${extensionVersion}` }}</div>
    <router-link to="/">Return</router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { browser } from 'webextension-polyfill-ts'

  export default defineComponent({
    name: 'Settings',
    computed: {
      extensionVersion() {
        return browser.runtime.getManifest().version
      },
    },
  })
</script>

<style lang="scss"></style>
