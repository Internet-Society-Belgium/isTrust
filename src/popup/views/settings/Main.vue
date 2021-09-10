<template>
    <div class="m-2 bg-container dark:bg-dark-container rounded-lg">
        <div class="grid grid-flow-row gap-2 p-3">
            <div class="flex items-center">
                <div class="flex-none">
                    <MoonIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">
                    {{ extension.methods.i18n('dark_mode') }}
                </p>
                <Switch
                    :active="settings.states.dark"
                    @click="settings.methods.toggleDark"
                />
            </div>

            <div class="flex items-center">
                <div class="flex-none">
                    <TranslateIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">
                    {{ extension.methods.i18n('language') }}
                </p>
                <Select />
            </div>

            <a
                class="flex items-center"
                href="#"
                @click="openUrl('mailto:trest@isoc.be')"
            >
                <div class="flex-none">
                    <ChatIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">
                    {{ extension.methods.i18n('feedback') }}
                </p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>

            <router-link
                to="/settings/more"
                tag="div"
                class="flex items-center"
            >
                <div class="flex-none">
                    <DocumentTextIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">
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
        MoonIcon,
        ChevronRightIcon,
        ChatIcon,
        DocumentTextIcon,
        TranslateIcon,
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
            MoonIcon,
            ChevronRightIcon,
            ChatIcon,
            DocumentTextIcon,
            TranslateIcon,
            Switch,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            return { extension, settings, openUrl }
        },
    })
</script>
