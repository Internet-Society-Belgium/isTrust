<template>
    <div class="grid grid-cols-3 m-0.5">
        <div class="justify-self-start flex items-center">
            <div v-if="!settingsViewOpened()">
                <router-link to="/settings" tag="div">
                    <CogIcon
                        class="w-6 h-6 text-secondary dark:text-dark-secondary"
                        :class="
                            settings.transitioning.dark
                                ? 'transition-colors duration-500'
                                : ''
                        "
                    />
                </router-link>
            </div>
            <div v-else>
                <router-link to="/" tag="div">
                    <CogIcon class="w-6 h-6 text-primary" />
                </router-link>
            </div>
        </div>

        <div class="justify-self-center flex items-center">
            <Loading :animation="false">
                <ViewTransition :transition="'scale'" :mode="'out-in'">
                    <p
                        v-if="settingsViewOpened()"
                        class="
                            text-sm text-secondary
                            dark:text-dark-secondary
                            select-none
                        "
                        :class="
                            settings.transitioning.dark
                                ? 'transition-colors duration-500'
                                : ''
                        "
                    >
                        {{ `v${extension.constants.version}` }}
                    </p>
                    <div v-else>
                        <div
                            v-if="
                                website.states?.data?.scores.score === 'warning'
                            "
                        >
                            <!-- report -->
                        </div>
                    </div>
                </ViewTransition>
            </Loading>
        </div>

        <div class="justify-self-end flex items-center">
            <button @click="openUrl(extension.states.chapterUrl)">
                <InformationCircleIcon
                    class="w-6 h-6 text-secondary dark:text-dark-secondary"
                    :class="
                        settings.transitioning.dark
                            ? 'transition-colors duration-500'
                            : ''
                    "
                />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { CogIcon, InformationCircleIcon } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { useRoute } from 'vue-router'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreSettingsKey } from '../types/store/settings'
    import { StoreWebsiteKey } from '../types/store/website'
    import { openUrl } from '../utils/url'
    import Loading from '../components/Loading.vue'
    import ViewTransition from '../components/ViewTransition.vue'
    export default defineComponent({
        name: 'Footer',
        components: {
            Loading,
            ViewTransition,
            CogIcon,
            InformationCircleIcon,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            if (!extension) {
                throw new Error(
                    `Could not resolve ${StoreExtensionKey.description}`
                )
            }
            const website = inject(StoreWebsiteKey)
            if (!website) {
                throw new Error(
                    `Could not resolve ${StoreWebsiteKey.description}`
                )
            }
            const settings = inject(StoreSettingsKey)
            if (!settings) {
                throw new Error(
                    `Could not resolve ${StoreSettingsKey.description}`
                )
            }
            const settingsViewOpened = () => {
                return useRoute().matched.find(
                    (route) => route.path === '/settings'
                )
            }
            return {
                website,
                extension,
                settings,
                settingsViewOpened,
                openUrl,
            }
        },
    })
</script>
