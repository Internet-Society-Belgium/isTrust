<template>
    <router-view v-slot="{ Component }">
        <ViewTransition>
            <component :is="Component" />
        </ViewTransition>
    </router-view>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        ShieldCheckIcon,
        UserGroupIcon,
        ScaleIcon,
        MoonIcon,
        ChevronRightIcon,
        HeartIcon,
        PlusIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../types/store/settings'
    import { openUrl } from '../utils/url'
    export default defineComponent({
        name: 'Settings',
        components: {
            ExternalLinkIcon,
            ShieldCheckIcon,
            UserGroupIcon,
            ScaleIcon,
            MoonIcon,
            ChevronRightIcon,
            HeartIcon,
            PlusIcon,
        },
        setup() {
            const settings = inject(StoreSettingsKey)
            return { settings, openUrl }
        },
    })
</script>
