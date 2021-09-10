<template>
    <div class="grid grid-cols-3 m-0.5">
        <div class="justify-self-start flex items-center">
            <div v-if="!settingsViewOpened()">
                <router-link to="/settings" tag="div">
                    <CogIcon class="w-6 h-6 text-secondary" />
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
                <ViewTransition>
                    <p v-if="settingsViewOpened()">
                        {{ `v${extension.constants.version}` }}
                    </p>
                    <div v-else>
                        <div v-if="website.states?.scores?.score === 'warning'">
                            <!-- report -->
                        </div>
                    </div>
                </ViewTransition>
            </Loading>
        </div>

        <div class="justify-self-end flex items-center">
            <a href="#" @click="openUrl(extension.states.chapter.url)">
                <InformationCircleIcon class="w-6 h-6 text-secondary" />
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import { CogIcon, InformationCircleIcon } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { useRoute } from 'vue-router'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreWebsiteKey } from '../types/store/website'
    import { openUrl } from '../utils/url'
    import Loading from '../components/Loading.vue'
    import ViewTransition from '../components/ViewTransition.vue'
    export default defineComponent({
        name: 'Footer',
        components: { Loading, ViewTransition, CogIcon, InformationCircleIcon },
        setup() {
            const extension = inject(StoreExtensionKey)
            const website = inject(StoreWebsiteKey)
            const settingsViewOpened = () => {
                return useRoute().name === 'Settings'
            }
            return { website, extension, settingsViewOpened, openUrl }
        },
    })
</script>
