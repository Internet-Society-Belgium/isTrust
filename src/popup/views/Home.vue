<template>
    <div class="w-80">
        <div class="text-center">
            <h3 class="text-lg">
                {{
                    website.states.internal
                        ? extension.i18n('internal')
                        : website.states.data.domain
                }}
            </h3>
        </div>

        <div>
            <router-view></router-view>
        </div>

        <div class="grid grid-cols-3">
            <div class="justify-self-start">
                <div v-if="!settingsViewOpened()">
                    <router-link to="/settings">open settings</router-link>
                </div>
                <div v-else>
                    <router-link to="/">close settings</router-link>
                </div>
            </div>

            <div class="justify-self-center">
                <button>report</button>
            </div>

            <div class="justify-self-end">
                <button @click="openUrl(extension.states.chapter.url)">
                    isoc
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { useRoute } from 'vue-router'
    import { browser } from 'webextension-polyfill-ts'
    export default defineComponent({
        name: 'App',
        setup() {
            const extension = inject('extension')
            const website = inject('website')
            const openUrl = async (url: string) => {
                await browser.tabs.create({ url })
            }
            const settingsViewOpened = () => {
                return useRoute().name === 'Settings'
            }
            return { website, extension, openUrl, settingsViewOpened }
        },
    })
</script>
