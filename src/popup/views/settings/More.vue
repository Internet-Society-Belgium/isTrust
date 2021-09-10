<template>
    <div class="m-2 bg-container rounded-lg">
        <div class="grid grid-flow-row gap-2 p-3">
            <a
                class="flex items-center"
                href="#"
                @click="
                    openUrl(
                        'https://github.com/Internet-Society-Belgium/trest/blob/main/PRIVACY.md'
                    )
                "
            >
                <div class="flex-none">
                    <ShieldCheckIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">
                    Privacy Policy
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>

            <a
                class="flex items-center"
                href="#"
                @click="
                    openUrl(
                        'https://github.com/Internet-Society-Belgium/trest/blob/main/LICENSE.md'
                    )
                "
            >
                <div class="flex-none">
                    <ScaleIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">License</p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>

            <a
                class="flex items-center"
                href="#"
                @click="
                    openUrl(
                        'https://github.com/Internet-Society-Belgium/trest/blob/main/CREDITS.md'
                    )
                "
            >
                <div class="flex-none">
                    <UserGroupIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">Credits</p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>

            <router-link to="/settings" tag="div" class="flex items-center">
                <div class="flex-none">
                    <AdjustmentsIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">Settings</p>
                <div class="flex-none">
                    <ChevronLeftIcon class="w-5 h-5 text-neutral" />
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        ShieldCheckIcon,
        UserGroupIcon,
        ScaleIcon,
        AdjustmentsIcon,
        ChevronLeftIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../../types/store/settings'
    import { openUrl } from '../../utils/url'
    export default defineComponent({
        name: 'Settings',
        components: {
            ExternalLinkIcon,
            ShieldCheckIcon,
            UserGroupIcon,
            ScaleIcon,
            AdjustmentsIcon,
            ChevronLeftIcon,
        },
        setup() {
            const settings = inject(StoreSettingsKey)
            return { settings, openUrl }
        },
    })
</script>
