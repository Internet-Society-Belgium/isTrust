<template>
    <div
        class="
            m-2
            bg-container
            dark:bg-dark-container
            transition-colors
            duration-500
            rounded-lg
        "
    >
        <div class="grid grid-flow-row gap-4 p-3">
            <router-link to="/settings" tag="div" class="flex items-center">
                <div class="flex-none">
                    <ChevronLeftIcon class="w-5 h-5 text-neutral" />
                </div>
                <p
                    class="
                        flex-grow
                        text-left text-secondary
                        dark:text-dark-secondary
                        transition-colors
                        duration-500
                        pl-2
                        pr-6
                        whitespace-nowrap
                        select-none
                    "
                >
                    {{ extension.methods.i18n('settings') }}
                </p>
            </router-link>
            <div class="grid grid-flow-row gap-2">
                <button
                    class="flex items-center"
                    @click="
                        openUrl(
                            'https://github.com/Internet-Society-Belgium/isTrust/blob/main/PRIVACY.md'
                        )
                    "
                >
                    <div class="flex-none">
                        <ShieldCheckIcon class="w-6 h-6 text-neutral" />
                    </div>
                    <p
                        class="
                            flex-grow
                            text-left text-secondary
                            dark:text-dark-secondary
                            transition-colors
                            duration-500
                            pl-2
                            pr-6
                            whitespace-nowrap
                            select-none
                        "
                    >
                        {{ extension.methods.i18n('privacy_policy') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                    </div>
                </button>

                <button
                    class="flex items-center"
                    @click="
                        openUrl(
                            'https://github.com/Internet-Society-Belgium/isTrust/blob/main/LICENSE.md'
                        )
                    "
                >
                    <div class="flex-none">
                        <ScaleIcon class="w-6 h-6 text-neutral" />
                    </div>
                    <p
                        class="
                            flex-grow
                            text-left text-secondary
                            dark:text-dark-secondary
                            transition-colors
                            duration-500
                            pl-2
                            pr-6
                            whitespace-nowrap
                            select-none
                        "
                    >
                        {{ extension.methods.i18n('license') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                    </div>
                </button>

                <button
                    class="flex items-center"
                    @click="
                        openUrl(
                            'https://github.com/Internet-Society-Belgium/isTrust/blob/main/CREDITS.md'
                        )
                    "
                >
                    <div class="flex-none">
                        <UserGroupIcon class="w-6 h-6 text-neutral" />
                    </div>
                    <p
                        class="
                            flex-grow
                            text-left text-secondary
                            dark:text-dark-secondary
                            transition-colors
                            duration-500
                            pl-2
                            pr-6
                            whitespace-nowrap
                            select-none
                        "
                    >
                        {{ extension.methods.i18n('credits') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        ShieldCheckIcon,
        UserGroupIcon,
        ScaleIcon,
        ChevronLeftIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../../types/store/extension'
    import { StoreSettingsKey } from '../../types/store/settings'
    import { openUrl } from '../../utils/url'
    export default defineComponent({
        name: 'Settings',
        components: {
            ExternalLinkIcon,
            ShieldCheckIcon,
            UserGroupIcon,
            ScaleIcon,
            ChevronLeftIcon,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            return { extension, settings, openUrl }
        },
    })
</script>
