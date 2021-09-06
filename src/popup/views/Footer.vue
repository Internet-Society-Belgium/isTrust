<template>
    <div class="grid grid-cols-3 m-0.5">
        <div class="justify-self-start w-5 h-5">
            <div v-if="!settingsViewOpened()">
                <router-link to="/settings" tag="div">
                    <CogIcon class="text-secondary" />
                </router-link>
            </div>
            <div v-else>
                <router-link to="/" tag="div">
                    <CogIcon class="text-primary" />
                </router-link>
            </div>
        </div>

        <div class="justify-self-center">
            <!-- <div>report</div> -->
        </div>

        <div class="justify-self-end w-5 h-5">
            <a href="#" @click="openUrl(extension.states.chapter.url)">
                <ExternalLinkIcon class="text-secondary" />
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import { CogIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { useRoute } from 'vue-router'
    import browser from 'webextension-polyfill'
    export default defineComponent({
        name: 'Header',
        components: { CogIcon, ExternalLinkIcon },
        setup() {
            const extension = inject('extension')
            const website = inject('website')
            const settingsViewOpened = () => {
                return useRoute().name === 'Settings'
            }
            const openUrl = async (url: string) => {
                await browser.tabs.create({ url })
            }
            return { website, extension, settingsViewOpened, openUrl }
        },
    })
</script>
