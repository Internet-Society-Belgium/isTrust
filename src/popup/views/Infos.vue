<template>
    <div
        v-if="website.states.internal"
        class="flex h-20 items-center justify-center"
    >
        <EyeOffIcon class="h-12 w-12 text-neutral" />
    </div>
    <div
        v-else-if="!website.states.loading && website.states.data === undefined"
        class="flex h-20 items-center justify-center"
    >
        <button @click="website.methods.reload">
            <RefreshIcon class="h-8 w-8 text-neutral" />
        </button>
    </div>
    <div v-else class="flex flex-col justify-center gap-4">
        <Title />

        <section
            class="rounded-lg bg-container p-2 ring-2 dark:bg-dark-container"
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
                    class="select-none p-1 text-sm italic text-secondary dark:text-dark-secondary"
                >
                    {{ extension.methods.i18n('domain') }}
                </h3>
                <Loading :animation="false">
                    <div v-if="website.states.data?.dns?.dnssec">
                        <Tooltip :text="'DNSSEC'">
                            <div class="px-1">
                                <BadgeCheckIcon class="h-4 w-4 text-neutral" />
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
            class="rounded-lg bg-container p-2 ring-2 dark:bg-dark-container"
            :class="
                website.states.data?.scores.communication.score === 'warning'
                    ? ' ring-warning'
                    : website.states.data?.scores.communication.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral'
            "
        >
            <h3
                class="select-none p-1 text-sm italic text-secondary dark:text-dark-secondary"
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
