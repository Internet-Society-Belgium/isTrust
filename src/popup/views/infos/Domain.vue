<template>
    <div v-if="!website.states.data?.dns" class="flex justify-center">
        <p>{{ extension.methods.i18n('no_info') }}</p>
    </div>
    <div v-else class="grid gap-2 p-2">
        <div>
            <div
                v-if="website.states.data?.dns?.events?.registration"
                class="p-1"
            >
                <div class="flex items-center gap-2">
                    <CakeIcon
                        class="flex-none w-6 h-6"
                        :class="
                            website.states?.scores?.domain?.registration ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral'
                        "
                    />
                    <div class="flex-grow">
                        <Tooltip
                            :disable="
                                website.states?.scores?.domain?.registration !==
                                'warning'
                            "
                            :text="extension.methods.i18n('less_x_month', '6')"
                        >
                            <p class="text-left whitespace-nowrap">
                                {{
                                    formatDate(
                                        website.states.data.dns.events
                                            .registration
                                    )
                                }}
                            </p>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div v-if="website.states.data?.dns?.events?.transfer" class="p-1">
                <div class="flex items-center gap-2">
                    <SwitchHorizontalIcon
                        class="flex-none w-6 h-6 text-neutral"
                    />
                    <div class="flex-grow">
                        <p class="text-left whitespace-nowrap">
                            {{
                                formatDate(
                                    website.states.data.dns.events.transfer
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
            <div
                v-if="website.states.data?.dns?.events?.lastChanged"
                class="p-1"
            >
                <div class="flex items-center gap-2">
                    <RefreshIcon
                        class="flex-none w-6 h-6"
                        :class="
                            website.states?.scores?.domain?.lastChanged ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral'
                        "
                    />
                    <div class="flex-grow">
                        <Tooltip
                            :disable="
                                website.states?.scores?.domain?.lastChanged !==
                                'warning'
                            "
                            :text="extension.methods.i18n('less_x_month', '1')"
                        >
                            <p class="text-left whitespace-nowrap">
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
            <div class="flex items-center gap-2">
                <OfficeBuildingIcon
                    class="flex-none w-6 h-6"
                    :class="
                        website.states?.scores?.domain?.registrant === 'warning'
                            ? 'text-warning'
                            : 'text-neutral'
                    "
                />
                <div class="flex-grow">
                    <p class="text-left whitespace-nowrap">
                        {{
                            website.states?.data?.dns?.registrant
                                ?.organisation ||
                            extension.methods.i18n('no_organisation')
                        }}
                    </p>
                </div>
            </div>
            <div
                v-if="website.states.data?.dns?.registrant?.location"
                class="flex items-center gap-2 pl-6"
            >
                <LocationMarkerIcon class="flex-none w-6 h-6 text-neutral" />
                <div class="flex-grow">
                    <p class="text-left whitespace-nowrap">
                        {{
                            [
                                website.states.data?.dns?.registrant?.location
                                    ?.state || '',
                                website.states.data?.dns?.registrant?.location
                                    ?.region || '',
                                website.states.data?.dns?.registrant?.location
                                    ?.country || '',
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
        SwitchHorizontalIcon,
        LocationMarkerIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../../types/store/extension'
    import { StoreSettingsKey } from '../../types/store/settings'
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
            SwitchHorizontalIcon,
            LocationMarkerIcon,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            const website = inject(StoreWebsiteKey)
            return { extension, settings, website, formatDate }
        },
    })
</script>
