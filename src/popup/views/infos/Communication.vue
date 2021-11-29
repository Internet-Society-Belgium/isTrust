<template>
    <div
        v-if="website.states.data?.url?.https === false"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center">
            <LockOpenIcon class="flex-none w-6 h-6 text-warning" />
            <button class="flex-grow px-2" @click="website.methods.goToHttps">
                <div class="flex items-center gap-1">
                    <span
                        class="text-sm text-secondary dark:text-dark-secondary"
                        >http</span
                    >
                    <ArrowNarrowRightIcon
                        class="w-6 h-6 text-neutral mx-1 animate-bounce-right"
                    />
                    <span
                        class="text-sm text-secondary dark:text-dark-secondary"
                        >https</span
                    >
                </div>
            </button>
        </div>
    </div>
    <div
        v-else-if="website.states.data?.url?.https === true"
        class="grid gap-2 p-2"
    >
        <div class="flex items-center">
            <div v-if="website.states.data.certificate?.valid">
                <Tooltip :text="website.states.data.certificate.protocol">
                    <LockClosedIcon class="flex-none w-6 h-6 text-neutral"
                /></Tooltip>
            </div>
            <div v-else>
                <LockClosedIcon class="flex-none w-6 h-6 text-neutral" />
            </div>
            <div class="flex-grow px-2">
                <p
                    class="text-sm text-left text-secondary dark:text-dark-secondary whitespace-nowrap"
                >
                    {{ extension.methods.i18n('secure') }}
                </p>
            </div>
        </div>
        <div v-if="website.states.data?.certificate">
            <div
                v-if="website.states.data?.certificate?.valid === false"
                class="flex items-center"
            >
                <IdentificationIcon class="flex-none w-6 h-6 text-warning" />
                <div class="flex-grow px-2">
                    <p
                        class="text-sm text-left text-secondary dark:text-dark-secondary whitespace-nowrap"
                    >
                        {{ extension.methods.i18n('certificate_invalid') }}
                    </p>
                </div>
            </div>

            <div v-else-if="website.states.data?.certificate?.owner">
                <div class="flex items-center">
                    <IdentificationIcon
                        class="flex-none w-6 h-6 text-neutral"
                    />
                    <div class="flex-grow px-2">
                        <p
                            class="text-sm text-left text-secondary dark:text-dark-secondary whitespace-nowrap"
                        >
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
                    class="flex items-center pl-6"
                >
                    <LocationMarkerIcon
                        class="flex-none w-6 h-6 text-neutral"
                    />
                    <div class="flex-grow px-2">
                        <p
                            class="text-sm text-left text-secondary dark:text-dark-secondary whitespace-nowrap"
                        >
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
    import { StoreWebsiteKey } from '../../types/store/website'

    import Tooltip from '../../components/Tooltip.vue'

    export default defineComponent({
        name: 'Communication',
        components: {
            Tooltip,
            LockClosedIcon,
            LockOpenIcon,
            IdentificationIcon,
            LocationMarkerIcon,
            ArrowNarrowRightIcon,
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
            return { extension, website }
        },
    })
</script>
