<template>
    <div
        class="flex flex-col justify-center align-middle gap-2 m-2"
        :class="[
            website.states.internal
                ? 'filter blur-sm pointer-events-none select-none'
                : '',
        ]"
    >
        <section class="bg-container rounded-lg p-2">
            <h3 class="p-1 italic">Domain</h3>

            <Loading>
                <div
                    v-if="!website.states.data?.dns"
                    class="flex justify-center"
                >
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
                                    class="flex-none w-5 h-5 text-neutral"
                                />
                                <div class="flex-grow">
                                    <p class="whitespace-nowrap">
                                        {{
                                            formatDate(
                                                website.states.data.dns.events
                                                    .registration
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="website.states.data?.dns?.events?.transfer"
                            class="p-1"
                        >
                            <div class="flex items-center gap-2">
                                <SwitchHorizontalIcon
                                    class="flex-none w-5 h-5 text-neutral"
                                />
                                <div class="flex-grow">
                                    <p class="whitespace-nowrap">
                                        {{
                                            formatDate(
                                                website.states.data.dns.events
                                                    .transfer
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
                                    class="flex-none w-5 h-5 text-neutral"
                                />
                                <div class="flex-grow">
                                    <p class="whitespace-nowrap">
                                        {{
                                            formatDate(
                                                website.states.data.dns.events
                                                    .lastChanged
                                            )
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            v-if="
                                website.states.data?.dns?.registrant
                                    ?.organisation
                            "
                            class="p-1"
                        >
                            <div class="flex items-center gap-2">
                                <OfficeBuildingIcon
                                    class="flex-none w-5 h-5 text-neutral"
                                />
                                <div class="flex-grow">
                                    <div class="flex items-center gap-0.5">
                                        <p>
                                            {{
                                                website.states.data.dns
                                                    .registrant.organisation
                                            }}
                                        </p>
                                        <div
                                            v-if="
                                                website.states.data.dns.dnssec
                                            "
                                        >
                                            <BadgeCheckIcon
                                                class="w-4 h-4 text-neutral"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="
                                    website.states.data?.dns?.registrant
                                        ?.location
                                "
                                class="flex items-center gap-2 pl-6"
                            >
                                <LocationMarkerIcon
                                    class="flex-none w-5 h-5 text-neutral"
                                />
                                <div class="flex-grow">
                                    <p class="whitespace-nowrap">
                                        {{
                                            [
                                                website.states.data?.dns
                                                    ?.registrant?.location
                                                    ?.state || '',
                                                website.states.data?.dns
                                                    ?.registrant?.location
                                                    ?.region || '',
                                                website.states.data?.dns
                                                    ?.registrant?.location
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
                </div>
            </Loading>
        </section>

        <section class="bg-container rounded-lg p-2">
            <h3 class="p-1 italic">Security</h3>

            <Loading>
                <div>
                    <div
                        v-if="website.states.data?.secure === false"
                        class="grid gap-2 p-2"
                    >
                        <div class="flex items-center gap-2">
                            <LockOpenIcon
                                class="flex-none w-5 h-5 text-warning"
                            />
                            <a href="#" class="flex-grow" @click="goToSecure">
                                <div class="flex items-center gap-1">
                                    <p>http</p>
                                    <ArrowNarrowRightIcon
                                        class="w-5 h-5 text-neutral"
                                    />
                                    <p>https</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div
                        v-else-if="website.states.data?.secure === true"
                        class="grid gap-2 p-2"
                    >
                        <div class="flex items-center gap-2">
                            <LockClosedIcon
                                class="flex-none w-5 h-5 text-neutral"
                            />
                            <div class="flex-grow">
                                <p class="whitespace-nowrap">
                                    Communication secured
                                </p>
                            </div>
                        </div>
                        <div v-if="website.states.data?.certificate">
                            <div
                                v-if="
                                    website.states.data?.certificate?.valid ===
                                    false
                                "
                                class="flex items-center gap-2"
                            >
                                <IdentificationIcon
                                    class="flex-none w-5 h-5 text-warning"
                                />
                                <div class="flex-grow">
                                    <p class="whitespace-nowrap">
                                        Certificate invalid
                                    </p>
                                </div>
                            </div>

                            <div
                                v-else-if="
                                    website.states.data?.certificate?.owner
                                "
                            >
                                <div class="flex items-center gap-2">
                                    <IdentificationIcon
                                        class="flex-none w-5 h-5 text-neutral"
                                    />
                                    <div class="flex-grow">
                                        <p class="whitespace-nowrap">
                                            {{
                                                website.states.data?.certificate
                                                    ?.owner?.organisation || ''
                                            }}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        website.states.data?.certificate?.owner
                                            ?.location
                                    "
                                    class="flex items-center gap-2 pl-6"
                                >
                                    <LocationMarkerIcon
                                        class="flex-none w-5 h-5 text-neutral"
                                    />
                                    <div class="flex-grow">
                                        <p class="whitespace-nowrap">
                                            {{
                                                [
                                                    website.states.data
                                                        ?.certificate?.owner
                                                        ?.location?.state || '',
                                                    website.states.data
                                                        ?.certificate?.owner
                                                        ?.location?.region ||
                                                        '',
                                                    website.states.data
                                                        ?.certificate?.owner
                                                        ?.location?.country ||
                                                        '',
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
                </div>
            </Loading>
        </section>

        <button v-if="settings.states.dev" @click="website.methods.clear">
            clear
        </button>
    </div>
</template>

<script lang="ts">
    import {
        CakeIcon,
        RefreshIcon,
        OfficeBuildingIcon,
        LockClosedIcon,
        LockOpenIcon,
        IdentificationIcon,
        BadgeCheckIcon,
        SwitchHorizontalIcon,
        LocationMarkerIcon,
        ArrowNarrowRightIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import browser from 'webextension-polyfill'
    import { StoreSettingsKey } from '../types/store/settings'
    import { StoreWebsiteKey } from '../types/store/website'
    import { formatDate } from '../utils/date'
    import Loading from '../components/Loading.vue'
    export default defineComponent({
        name: 'Home',
        components: {
            Loading,
            CakeIcon,
            RefreshIcon,
            OfficeBuildingIcon,
            LockClosedIcon,
            LockOpenIcon,
            IdentificationIcon,
            BadgeCheckIcon,
            SwitchHorizontalIcon,
            LocationMarkerIcon,
            ArrowNarrowRightIcon,
        },
        setup() {
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
            return { settings, website, formatDate, goToSecure }
        },
    })
</script>
