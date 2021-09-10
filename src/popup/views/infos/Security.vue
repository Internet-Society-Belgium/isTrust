<template>
    <div
        v-if="website.states.data?.url?.https === false"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center gap-2">
            <LockOpenIcon class="flex-none w-6 h-6 text-warning" />
            <a href="#" class="flex-grow" @click="goToSecure">
                <div class="flex items-center gap-1">
                    <p>http</p>
                    <ArrowNarrowRightIcon class="w-6 h-6 text-neutral" />
                    <p>https</p>
                </div>
            </a>
        </div>
    </div>
    <div
        v-else-if="website.states.data?.url?.https === true"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center gap-2">
            <LockClosedIcon class="flex-none w-6 h-6 text-neutral" />
            <div class="flex-grow">
                <p class="whitespace-nowrap">
                    {{ extension.methods.i18n('communication_secured') }}
                </p>
            </div>
        </div>
        <div v-if="website.states.data?.certificate">
            <div
                v-if="website.states.data?.certificate?.valid === false"
                class="flex items-center gap-2"
            >
                <IdentificationIcon class="flex-none w-6 h-6 text-warning" />
                <div class="flex-grow">
                    <p class="whitespace-nowrap">
                        {{ extension.methods.i18n('certificate_invalid') }}
                    </p>
                </div>
            </div>

            <div v-else-if="website.states.data?.certificate?.owner">
                <div class="flex items-center gap-2">
                    <IdentificationIcon
                        class="flex-none w-6 h-6 text-neutral"
                    />
                    <div class="flex-grow">
                        <p class="whitespace-nowrap">
                            {{
                                website.states.data?.certificate?.owner
                                    ?.organisation || ''
                            }}
                        </p>
                    </div>
                </div>
                <div
                    v-if="website.states.data?.certificate?.owner?.location"
                    class="flex items-center gap-2 pl-6"
                >
                    <LocationMarkerIcon
                        class="flex-none w-6 h-6 text-neutral"
                    />
                    <div class="flex-grow">
                        <p class="whitespace-nowrap">
                            {{
                                [
                                    website.states.data?.certificate?.owner
                                        ?.location?.state || '',
                                    website.states.data?.certificate?.owner
                                        ?.location?.region || '',
                                    website.states.data?.certificate?.owner
                                        ?.location?.country || '',
                                ]
                                    .filter((e) => e != '')
                                    .join(' - ')
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        LockClosedIcon,
        LockOpenIcon,
        IdentificationIcon,
        LocationMarkerIcon,
        ArrowNarrowRightIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import browser from 'webextension-polyfill'
    import { StoreExtensionKey } from '../../types/store/extension'
    import { StoreSettingsKey } from '../../types/store/settings'
    import { StoreWebsiteKey } from '../../types/store/website'
    export default defineComponent({
        name: 'Security',
        components: {
            LockClosedIcon,
            LockOpenIcon,
            IdentificationIcon,
            LocationMarkerIcon,
            ArrowNarrowRightIcon,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            const website = inject(StoreWebsiteKey)
            const goToSecure = async () => {
                const tab = await browser.tabs.query({
                    active: true,
                    currentWindow: true,
                })
                if (!tab) return
                const id = tab[0].id
                const url = tab[0].url
                if (!id || !url) return
                await browser.tabs.update({
                    url: url.replace('http://', 'https://'),
                })
                window.close()
            }
            return { extension, settings, website, goToSecure }
        },
    })
</script>
