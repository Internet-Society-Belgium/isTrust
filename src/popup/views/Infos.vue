<template>
    <div
        v-if="website.states.internal"
        class="flex justify-center items-center h-20"
    >
        <EyeOffIcon class="w-12 h-12 text-neutral" />
    </div>
    <div
        v-else-if="!website.states.loading && !website.states?.data"
        class="flex justify-center items-center h-20"
    >
        <button @click="website.methods.reload">
            <RefreshIcon class="w-8 h-8 text-neutral" />
        </button>
    </div>
    <div v-else class="flex flex-col justify-center gap-4">
        <Title />

        <section
            class="bg-container dark:bg-dark-container rounded-lg p-2 ring-2"
            :class="
                website.states.data?.scores.domain.score === 'warning'
                    ? ' ring-warning'
                    : website.states.data?.scores.domain.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral'
            "
        >
            <div class="flex items-center">
                <h3
                    class="
                        p-1
                        text-sm
                        italic
                        text-secondary
                        dark:text-dark-secondary
                        select-none
                    "
                >
                    {{ extension.methods.i18n('domain') }}
                </h3>
                <Loading :animation="false">
                    <div v-if="website.states?.data?.dns?.dnssec">
                        <Tooltip :text="'DNSSEC'">
                            <div class="px-1">
                                <BadgeCheckIcon class="w-4 h-4 text-neutral" />
                            </div>
                        </Tooltip>
                    </div>
                </Loading>
            </div>

            <Loading>
                <Domain />
            </Loading>
        </section>

        <section
            class="bg-container dark:bg-dark-container rounded-lg p-2 ring-2"
            :class="
                website.states.data?.scores.communication.score === 'warning'
                    ? ' ring-warning'
                    : website.states.data?.scores.communication.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral'
            "
        >
            <h3
                class="
                    p-1
                    text-sm
                    italic
                    text-secondary
                    dark:text-dark-secondary
                    select-none
                "
            >
                {{ extension.methods.i18n('communication') }}
            </h3>

            <Loading>
                <Communication />
            </Loading>
        </section>
    </div>
</template>

<script lang="ts">
    import {
        BadgeCheckIcon,
        EyeOffIcon,
        RefreshIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreWebsiteKey } from '../types/store/website'
    import Loading from '../components/Loading.vue'
    import Tooltip from '../components/Tooltip.vue'
    import Communication from './infos/Communication.vue'
    import Domain from './infos/Domain.vue'
    import Title from './infos/Title.vue'
    export default defineComponent({
        name: 'Infos',
        components: {
            Loading,
            Tooltip,
            Title,
            Domain,
            Communication,
            BadgeCheckIcon,
            EyeOffIcon,
            RefreshIcon,
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
            return {
                extension,
                website,
            }
        },
    })
</script>
