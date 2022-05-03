<template>
    <div
        class="m-2 rounded-lg bg-container transition-colors duration-500 dark:bg-dark-container"
    >
        <div class="grid grid-flow-row gap-2 p-3">
            <div class="flex w-full flex-row items-center gap-2 px-4 py-2">
                <SunIcon class="h-6 w-6 flex-grow text-neutral" />
                <Switch
                    class="flex-none"
                    :active="settings.states.dark"
                    @click="settings.methods.toggleDark"
                />
                <MoonIcon class="h-6 w-6 flex-grow text-neutral" />
            </div>

            <button
                class="flex items-center"
                @click="
                    openUrl(
                        'https://github.com/Internet-Society-Belgium/isTrust/issues/new/choose'
                    )
                "
            >
                <div class="flex-none">
                    <ChatIcon class="h-6 w-6 text-neutral" />
                </div>
                <p
                    class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary transition-colors duration-500 dark:text-dark-secondary"
                >
                    {{ extension.methods.i18n('report_bug') }}
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="h-5 w-5 text-neutral" />
                </div>
            </button>

            <button
                class="flex items-center"
                @click="openUrl('mailto:istrust@isoc.be')"
            >
                <div class="flex-none">
                    <MailIcon class="h-6 w-6 text-neutral" />
                </div>
                <p
                    class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary transition-colors duration-500 dark:text-dark-secondary"
                >
                    {{ extension.methods.i18n('feedback') }}
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="h-5 w-5 text-neutral" />
                </div>
            </button>

            <router-link
                to="/settings/more"
                tag="div"
                class="flex items-center"
            >
                <div class="flex-none">
                    <DocumentTextIcon class="h-6 w-6 text-neutral" />
                </div>
                <p
                    class="flex-grow select-none whitespace-nowrap pl-2 pr-6 text-left text-sm text-secondary transition-colors duration-500 dark:text-dark-secondary"
                >
                    {{ extension.methods.i18n('legal') }}
                </p>
                <div class="flex-none">
                    <ChevronRightIcon class="h-5 w-5 text-neutral" />
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        SunIcon,
        MoonIcon,
        ChevronRightIcon,
        DocumentTextIcon,
        ChatIcon,
        MailIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'

    import { StoreExtensionKey } from '../../types/store/extension'
    import { StoreSettingsKey } from '../../types/store/settings'

    import { openUrl } from '../../utils/url'

    import Switch from '../../components/Switch.vue'

    export default defineComponent({
        name: 'SettingsMain',
        components: {
            ExternalLinkIcon,
            SunIcon,
            MoonIcon,
            ChevronRightIcon,
            DocumentTextIcon,
            ChatIcon,
            MailIcon,
            Switch,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            if (!extension) {
                throw new Error(
                    `Could not resolve ${StoreExtensionKey.description}`
                )
            }
            const settings = inject(StoreSettingsKey)
            if (!settings) {
                throw new Error(
                    `Could not resolve ${StoreSettingsKey.description}`
                )
            }
            return { extension, settings, openUrl }
        },
    })
</script>
