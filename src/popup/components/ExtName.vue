<template>
  <div>
    <p>{{ extName }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { browser } from 'webextension-polyfill-ts'

export default defineComponent({
  name: 'ExtName',
  computed: {
    extName(): string {
      return browser.i18n.getMessage('extName')
    },
  },
})
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
