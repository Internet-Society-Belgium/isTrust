<template>
    <div
        class="flex flex-col justify-center align-middle gap-2 m-2"
        :class="[website.states.internal ? 'filter blur-sm' : '']"
    >
        <section class="bg-container rounded-lg p-2 grid gap-2">
            <h3>Trustability</h3>

            <Loading>
                <div>
                    <div
                        v-if="website.states.data?.dns?.events.registration"
                        class="p-1"
                    >
                        <div class="flex items-center gap-1">
                            <CakeIcon
                                class="flex-none w-4 h-4 text-neutral-text"
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
                        <div class="flex items-center gap-1">
                            <RefreshIcon
                                class="flex-none w-4 h-4 text-neutral-text"
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
                            website.states.data?.dns?.registrant?.organisation
                        "
                        class="p-1"
                    >
                        <div class="flex items-center gap-1">
                            <OfficeBuildingIcon
                                class="flex-none w-4 h-4 text-neutral-text"
                            />
                            <div class="flex-grow">
                                <p>
                                    {{
                                        website.states.data.dns.registrant
                                            .organisation
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Loading>
        </section>
        <section class="bg-container rounded-lg p-2">
            <h3>Security</h3>

            <Loading> DATA </Loading>
        </section>
        <section class="bg-container rounded-lg p-2">
            <h3>Privacy</h3>

            <Loading> DATA </Loading>
        </section>

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
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { formatDate } from '../utils/date'
    import Loading from '../components/Loading.vue'
    export default defineComponent({
        name: 'Home',
        components: { Loading, CakeIcon, RefreshIcon, OfficeBuildingIcon },
        setup() {
            const settings = inject('settings')
            const website = inject('website')
            return { settings, website, formatDate }
        },
    })
</script>
