<template>
    <div
        class="flex flex-col justify-center align-middle gap-2 m-2"
        :class="[website.states.internal ? 'filter blur-sm' : '']"
    >
        <section class="bg-container rounded-lg p-2">
            <h3>Trustability</h3>

            <Loading>
                <div class="grid gap-2 p-2">
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
                        </div>
                    </div>
                </div>
            </Loading>
        </section>

        <section class="bg-container rounded-lg p-2">
            <h3>Security</h3>

            <Loading>
                <div class="grid gap-2 p-2">
                    <div>
                        <div
                            v-if="website.states.data?.certificate"
                            class="p-1"
                        >
                            <div v-if="website.states.data.certificate.valid">
                                <div class="flex items-center gap-2">
                                    <LockClosedIcon
                                        class="flex-none w-5 h-5 text-ok"
                                    />
                                    <div class="flex-grow">
                                        <p class="whitespace-nowrap">
                                            Communication secured
                                        </p>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        website.states.data?.certificate?.owner
                                    "
                                    class="flex items-center gap-2"
                                >
                                    <KeyIcon
                                        class="flex-none w-5 h-5 text-neutral"
                                    />
                                    <div class="flex-grow">
                                        <p class="whitespace-nowrap">
                                            {{
                                                website.states.data.certificate
                                                    .owner.organisation
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="flex items-center gap-2">
                                    <LockOpenIcon
                                        class="flex-none w-5 h-5 text-warning"
                                    />
                                    <div class="flex-grow">
                                        <p class="whitespace-nowrap">
                                            Communication not secured
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Loading>
        </section>

        <!-- <section class="bg-container rounded-lg p-2">
            <h3>Privacy</h3>

            <Loading> DATA </Loading>
        </section> -->

        <button v-if="settings.states.dev" @click="website.methods.refresh">
            refresh
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
        KeyIcon,
        BadgeCheckIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
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
            KeyIcon,
            BadgeCheckIcon,
        },
        setup() {
            const settings = inject('settings')
            const website = inject('website')
            return { settings, website, formatDate }
        },
    })
</script>
