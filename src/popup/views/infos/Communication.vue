<template>
    <div v-if="!website.states.data?.url.https" class="grid gap-2 p-2">
        <div class="flex items-center">
            <LockOpenIcon class="h-6 w-6 flex-none text-warning" />
            <button class="flex-grow px-2" @click="website.methods.goToHttps">
                <div class="flex items-center gap-1">
                    <span
                        class="text-sm text-secondary dark:text-dark-secondary"
                        >http</span
                    >
                    <ArrowNarrowRightIcon
                        class="mx-1 h-6 w-6 animate-bounce-right text-neutral"
                    />
                    <span
                        class="text-sm text-secondary dark:text-dark-secondary"
                        >https</span
                    >
                </div>
            </button>
        </div>
    </div>
    <div v-else class="grid gap-2 p-2">
        <div
            v-if="
                website.states.data.certificate === undefined ||
                !website.states.data.certificate.valid
            "
        >
            <div class="flex items-center">
                <LockOpenIcon class="h-6 w-6 flex-none text-warning" />
                <div class="flex-grow px-2">
                    <p
                        class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{ extension.methods.i18n('insecure') }}
                    </p>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex items-center">
                <Tooltip :text="website.states.data.certificate.protocol">
                    <LockClosedIcon class="h-6 w-6 flex-none text-neutral"
                /></Tooltip>
                <div class="flex-grow px-2">
                    <p
                        class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{ extension.methods.i18n('secure') }}
                    </p>
                </div>
            </div>

            <div v-if="website.states.data.certificate.owner">
                <div class="flex items-center">
                    <IdentificationIcon
                        class="h-6 w-6 flex-none text-neutral"
                    />
                    <div class="flex-grow px-2">
                        <p
                            class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                        >
                            {{
                                website.states.data.certificate.owner
                                    .organisation
                            }}
                        </p>
                    </div>
                </div>
                <div
                    v-if="website.states.data.certificate.owner.location"
                    class="flex items-center pl-6"
                >
                    <LocationMarkerIcon
                        class="h-6 w-6 flex-none text-neutral"
                    />
                    <div class="flex-grow px-2">
                        <p
                            class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                        >
                            {{
                                [
                                    website.states.data.certificate.owner
                                        .location.state,
                                    website.states.data.certificate.owner
                                        .location.region,
                                    website.states.data.certificate.owner
                                        .location.country,
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
