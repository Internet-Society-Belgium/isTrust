<template>
  <div class="settings">
    <h1>Settings</h1>
    <div>{{ JSON.stringify(settings, null, 2) }}</div>
    <div>{{ `v${extension.version}` }}</div>
    <button @click="settings.methods.toggleDev">
      {{ settings.states.dev ? 'dev' : 'not dev' }}
    </button>
    <router-link to="/">Return</router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent, inject } from 'vue'

  export default defineComponent({
    name: 'Settings',
    setup() {
      const extension = inject('extension')
      const settings = inject('settings')

      return {
        extension,
        settings,
      }
    },
  })
</script>

<style lang="scss"></style>
