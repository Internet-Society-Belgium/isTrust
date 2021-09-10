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
                    <ShieldCheckIcon class="w-5 h-5 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-3 whitespace-nowrap">
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
                    <ScaleIcon class="w-5 h-5 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-3 whitespace-nowrap">License</p>
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
                    <UsersIcon class="w-5 h-5 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-3 whitespace-nowrap">Credits</p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        ShieldCheckIcon,
        UsersIcon,
        ScaleIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../types/store/settings'
    import { openUrl } from '../utils/url'
    export default defineComponent({
        name: 'Settings',
        components: { ExternalLinkIcon, ShieldCheckIcon, UsersIcon, ScaleIcon },
        setup() {
            const settings = inject(StoreSettingsKey)
            return { settings, openUrl }
        },
    })
</script>
