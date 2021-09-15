<template>
    <router-view v-slot="{ Component }">
        <div class="w-full min-h-40">
            <ViewTransition
                :transition="toChild ? 'slide-left' : 'slide-right'"
                :mode="'out-in'"
            >
                <component :is="Component" />
            </ViewTransition>
        </div>
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
    import { defineComponent, inject, ref, watch } from 'vue'
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
            const toChild = ref(false)
            const lastRoute = ref('/')
            watch(useRoute(), (route) => {
                const fromDepth = lastRoute.value.split('/').length
                const toDepth = route.path.split('/').length
                toChild.value = fromDepth < toDepth
                lastRoute.value = route.path
            })
            return {
                settings,
                toChild,
                openUrl,
            }
        },
    })
</script>
