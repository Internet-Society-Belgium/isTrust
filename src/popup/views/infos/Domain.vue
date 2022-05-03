<template>
    <div
        v-if="
            website.states.data?.dns === undefined ||
            (Object.keys(website.states.data.dns).length === 1 &&
                !website.states.data?.dns.technicalError)
        "
        class="flex justify-center"
    >
        <p
            class="whitespace-nowrap text-sm text-secondary dark:text-dark-secondary"
        >
            {{ extension.methods.i18n('no_info') }}
        </p>
    </div>
    <div
        v-else-if="
            Object.keys(website.states.data.dns).length === 1 &&
            website.states.data?.dns.technicalError
        "
        class="flex justify-center"
    >
        <p
            class="whitespace-nowrap text-sm text-secondary dark:text-dark-secondary"
        >
            {{ extension.methods.i18n('unavailable') }}
        </p>
    </div>
    <div v-else class="grid gap-2 p-2">
        <div>
            <div class="p-1">
                <div class="flex items-center">
                    <CakeIcon
                        class="h-6 w-6 flex-none"
                        :class="
                            website.states.data.scores.domain.registration ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral'
                        "
                    />
                    <div class="flex-grow px-2">
                        <Tooltip
                            :disable="
                                website.states.data.scores.domain
                                    .registration !== 'warning'
                            "
                            :text="extension.methods.i18n('less_x_month', '6')"
                        >
                            <p
                                class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                            >
                                {{
                                    website.states.data.dns.events?.registration
                                        ? formatDate(
                                              website.states.data.dns.events
                                                  .registration
                                          )
                                        : website.states.data.dns.technicalError
                                        ? extension.methods.i18n('unavailable')
                                        : extension.methods.i18n('no_date')
                                }}
                            </p>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div v-if="website.states.data.dns.events?.lastChanged" class="p-1">
                <div class="flex items-center">
                    <RefreshIcon
                        class="h-6 w-6 flex-none"
                        :class="
                            website.states.data.scores.domain.lastChanged ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral'
                        "
                    />
                    <div class="flex-grow px-2">
                        <Tooltip
                            :disable="
                                website.states.data.scores.domain
                                    .lastChanged !== 'warning'
                            "
                            :text="extension.methods.i18n('less_x_month', '1')"
                        >
                            <p
                                class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                            >
                                {{
                                    formatDate(
                                        website.states.data.dns.events
                                            .lastChanged
                                    )
                                }}
                            </p></Tooltip
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="p-1">
            <div class="flex items-center">
                <OfficeBuildingIcon
                    class="h-6 w-6 flex-none"
                    :class="
                        website.states.data.scores.domain.registrant ===
                        'warning'
                            ? 'text-warning'
                            : 'text-neutral'
                    "
                />
                <div class="flex-grow px-2">
                    <p
                        class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{
                            website.states.data.dns.registrant?.organisation
                                ? website.states.data.dns.registrant
                                      .organisation
                                : website.states.data.dns.technicalError
                                ? extension.methods.i18n('unavailable')
                                : extension.methods.i18n('no_organisation')
                        }}
                    </p>
                </div>
            </div>
            <div
                v-if="website.states.data.dns.registrant?.location"
                class="flex items-center pl-6"
            >
                <LocationMarkerIcon class="h-6 w-6 flex-none text-neutral" />
                <div class="flex-grow px-2">
                    <p
                        class="whitespace-nowrap text-left text-sm text-secondary dark:text-dark-secondary"
                    >
                        {{
                            [
                                website.states.data.dns.registrant.location
                                    .state,
                                website.states.data.dns.registrant.location
                                    .region,
                                website.states.data.dns.registrant.location
                                    .country,
                            ]
                                .filter((e) => e != '')
                                .join(' - ')
                        }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        CakeIcon,
        RefreshIcon,
        OfficeBuildingIcon,
        LocationMarkerIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'

    import { StoreExtensionKey } from '../../types/store/extension'
    import { StoreWebsiteKey } from '../../types/store/website'

    import { formatDate } from '../../utils/date'

    import Tooltip from '../../components/Tooltip.vue'

    export default defineComponent({
        name: 'Domain',
        components: {
            Tooltip,
            CakeIcon,
            RefreshIcon,
            OfficeBuildingIcon,
            LocationMarkerIcon,
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
            return { extension, website, formatDate }
        },
    })
</script>
