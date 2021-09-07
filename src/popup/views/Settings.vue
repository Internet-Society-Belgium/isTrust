<template>
    <div class="">
        <div>{{ JSON.stringify(settings, null, 2) }}</div>
        <div>{{ `v${extension.constants.version}` }}</div>
        <button @click="settings.methods.toggleDev">
            {{ settings.states.dev ? 'dev' : 'not dev' }}
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreSettingsKey } from '../types/store/settings'
    export default defineComponent({
        name: 'Settings',
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            return { extension, settings }
        },
    })
</script>
