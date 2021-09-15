<template>
    <div
        v-if="website.states.data?.url?.https === false"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center gap-2">
            <LockOpenIcon class="flex-none w-6 h-6 text-warning" />
            <button class="flex-grow" @click="website.methods.goToHttps">
                <div class="flex items-center gap-1">
                    <p>http</p>
                    <ArrowNarrowRightIcon class="w-6 h-6 text-neutral" />
                    <p>https</p>
                </div>
            </button>
        </div>
    </div>
    <div
        v-else-if="website.states.data?.url?.https === true"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center gap-2">
            <LockClosedIcon class="flex-none w-6 h-6 text-neutral" />
            <div class="flex-grow">
                <p class="text-left whitespace-nowrap">
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
                    <p class="text-left whitespace-nowrap">
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
                        <p class="text-left whitespace-nowrap">
                            {{
                                website.states.data?.certificate?.owner
                                    ?.organisation ||
                                extension.methods.i18n('no_organisation')
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
                        <p class="text-left whitespace-nowrap">
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
            return { extension, settings, website }
        },
    })
</script>
