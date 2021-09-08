<template>
    <div v-if="!website.states.data?.dns" class="flex justify-center">
        <p>No infos</p>
    </div>
    <div v-else class="grid gap-2 p-2">
        <div>
            <div
                v-if="website.states.data?.dns?.events.registration"
                class="p-1"
            >
                <div class="flex items-center gap-2">
                    <CakeIcon
                        class="flex-none w-5 h-5"
                        :class="[
                            website.states?.score?.domain?.registration ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral',
                        ]"
                    />
                    <div class="flex-grow">
                        <p class="whitespace-nowrap">
                            {{
                                formatDate(
                                    website.states.data.dns.events.registration
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="website.states.data?.dns?.events?.transfer" class="p-1">
                <div class="flex items-center gap-2">
                    <SwitchHorizontalIcon
                        class="flex-none w-5 h-5 text-neutral"
                    />
                    <div class="flex-grow">
                        <p class="whitespace-nowrap">
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
                        class="flex-none w-5 h-5"
                        :class="[
                            website.states?.score?.domain?.lastChanged ===
                            'warning'
                                ? 'text-warning'
                                : 'text-neutral',
                        ]"
                    />
                    <div class="flex-grow">
                        <p class="whitespace-nowrap">
                            {{
                                formatDate(
                                    website.states.data.dns.events.lastChanged
                                )
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-1">
            <div class="flex items-center gap-2">
                <OfficeBuildingIcon
                    class="flex-none w-5 h-5"
                    :class="[
                        website.states?.score?.domain?.registrant === 'warning'
                            ? 'text-warning'
                            : 'text-neutral',
                    ]"
                />
                <div class="flex-grow">
                    <div class="flex items-center gap-0.5">
                        <p>
                            {{
                                website.states?.data?.dns?.registrant
                                    ?.organisation || 'No organisation'
                            }}
                        </p>
                        <div v-if="website.states?.data?.dns?.dnssec">
                            <BadgeCheckIcon class="w-4 h-4 text-neutral" />
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="website.states.data?.dns?.registrant?.location"
                class="flex items-center gap-2 pl-6"
            >
                <LocationMarkerIcon class="flex-none w-5 h-5 text-neutral" />
                <div class="flex-grow">
                    <p class="whitespace-nowrap">
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
        BadgeCheckIcon,
        SwitchHorizontalIcon,
        LocationMarkerIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../../types/store/settings'
    import { StoreWebsiteKey } from '../../types/store/website'
    import { formatDate } from '../../utils/date'
    export default defineComponent({
        name: 'Domain',
        components: {
            CakeIcon,
            RefreshIcon,
            OfficeBuildingIcon,
            BadgeCheckIcon,
            SwitchHorizontalIcon,
            LocationMarkerIcon,
        },
        setup() {
            const settings = inject(StoreSettingsKey)
            const website = inject(StoreWebsiteKey)
            return { settings, website, formatDate }
        },
    })
</script>
