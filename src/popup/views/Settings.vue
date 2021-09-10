<template>
    <router-view v-slot="{ Component }">
        <ViewTransition
            :transition="
                settingsMainViewOpened() ? 'slide-right' : 'slide-left'
            "
        >
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
    import { useRoute } from 'vue-router'
    import { StoreSettingsKey } from '../types/store/settings'
    import { openUrl } from '../utils/url'
    import ViewTransition from '../components/ViewTransition.vue'
    export default defineComponent({
        name: 'Settings',
        components: {
            ViewTransition,
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
            const settingsMainViewOpened = () => {
                return useRoute().name === 'SettingsMain'
            }
            return { settings, settingsMainViewOpened, openUrl }
        },
    })
</script>
