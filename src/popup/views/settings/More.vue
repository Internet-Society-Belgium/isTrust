<template>
    <div class="m-2 rounded-lg bg-container dark:bg-dark-container">
        <div class="grid grid-flow-row gap-4 p-3">
            <router-link to="/settings" tag="div" class="flex items-center">
                <div class="flex-none">
                    <ChevronLeftIcon class="h-5 w-5 text-neutral" />
                </div>
                <p
                    class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary dark:text-dark-secondary"
                >
                    {{ extension.methods.i18n('settings') }}
                </p>
            </router-link>
            <div class="grid grid-flow-row gap-2">
                <button
                    class="flex items-center"
                    @click="
                        openUrl(
                            'https://github.com/Internet-Society-Belgium/isTrust/blob/main/CREDITS.md'
                        )
                    "
                >
                    <div class="flex-none">
                        <UserGroupIcon class="h-6 w-6 text-neutral" />
                    </div>
                    <p
                        class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{ extension.methods.i18n('credits') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="h-5 w-5 text-neutral" />
                    </div>
                </button>

                <button
                    class="flex items-center"
                    @click="
                        openUrl(
                            'https://github.com/Internet-Society-Belgium/isTrust/blob/main/PRIVACY.md'
                        )
                    "
                >
                    <div class="flex-none">
                        <ShieldCheckIcon class="h-6 w-6 text-neutral" />
                    </div>
                    <p
                        class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{ extension.methods.i18n('privacy_policy') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="h-5 w-5 text-neutral" />
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
                        <ScaleIcon class="h-6 w-6 text-neutral" />
                    </div>
                    <p
                        class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{ extension.methods.i18n('license') }}
                    </p>
                    <div class="flex-none">
                        <ExternalLinkIcon class="h-5 w-5 text-neutral" />
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
            if (!extension) {
                throw new Error(
                    `Could not resolve ${StoreExtensionKey.description}`
                )
            }
            return { extension, openUrl }
        },
    })
</script>
