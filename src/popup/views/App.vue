<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, provide } from 'vue'

    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreSettingsKey } from '../types/store/settings'
    import { StoreWebsiteKey } from '../types/store/website'

    import extension from '../store/extension'
    import settings from '../store/settings'
    import website from '../store/website'

    export default defineComponent({
        name: 'App',
        setup() {
            provide(StoreExtensionKey, extension)
            provide(StoreSettingsKey, settings)
            provide(StoreWebsiteKey, website)
        },
    })
</script>
