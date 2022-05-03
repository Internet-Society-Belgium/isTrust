<template>
    <div class="pointer-events-none flex select-none justify-center">
        <div class="flex items-center gap-2">
            <img src="../../../assets/icons/icon.svg" alt="" class="h-6 w-6" />
            <h1
                class="whitespace-nowrap text-center text-base font-semibold text-secondary dark:text-dark-secondary"
                :class="
                    settings.transitioning.dark
                        ? 'transition-colors duration-500'
                        : ''
                "
            >
                {{ extension.methods.i18n('extension_name') }}
            </h1>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'

    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreSettingsKey } from '../types/store/settings'

    export default defineComponent({
        name: 'Header',
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
            return { extension, settings }
        },
    })
</script>
