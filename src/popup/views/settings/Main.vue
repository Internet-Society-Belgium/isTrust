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
        <div class="grid grid-flow-row gap-2 p-3">
            <div class="w-full flex flex-row gap-2 items-center px-4 py-2">
                <SunIcon class="flex-grow w-6 h-6 text-neutral" />
                <Switch
                    class="flex-none"
                    :active="settings.states.dark"
                    @click="settings.methods.toggleDark"
                />
                <MoonIcon class="flex-grow w-6 h-6 text-neutral" />
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
                    <ChatIcon class="w-6 h-6 text-neutral" />
                </div>
                <p
                    class="
                        flex-grow
                        text-sm text-left text-secondary
                        dark:text-dark-secondary
                        transition-colors
                        duration-500
                        pl-2
                        pr-6
                        whitespace-nowrap
                        select-none
                    "
                >
                    {{ extension.methods.i18n('report_bug') }}
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </button>

            <button
                class="flex items-center"
                @click="openUrl('mailto:istrust@isoc.be')"
            >
                <div class="flex-none">
                    <MailIcon class="w-6 h-6 text-neutral" />
                </div>
                <p
                    class="
                        flex-grow
                        text-sm text-left text-secondary
                        dark:text-dark-secondary
                        transition-colors
                        duration-500
                        pl-2
                        pr-6
                        whitespace-nowrap
                        select-none
                    "
                >
                    {{ extension.methods.i18n('feedback') }}
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </button>

            <router-link
                to="/settings/more"
                tag="div"
                class="flex items-center"
            >
                <div class="flex-none">
                    <DocumentTextIcon class="w-6 h-6 text-neutral" />
                </div>
                <p
                    class="
                        flex-grow
                        text-sm text-left text-secondary
                        dark:text-dark-secondary
                        transition-colors
                        duration-500
                        pl-2
                        pr-6
                        whitespace-nowrap
                        select-none
                    "
                >
                    {{ extension.methods.i18n('legal') }}
                </p>
                <div class="flex-none">
                    <ChevronRightIcon class="w-5 h-5 text-neutral" />
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
