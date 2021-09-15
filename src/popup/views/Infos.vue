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
        <section
            class="bg-container dark:bg-dark-container rounded-lg p-2 ring-2"
            :class="
                website.states?.scores?.domain?.score === 'warning'
                    ? ' ring-warning'
                    : website.states?.scores?.domain?.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral'
            "
        >
            <div class="flex items-center gap-0.5">
                <h3 class="p-1 italic select-none">
                    {{ extension.methods.i18n('domain') }}
                </h3>
                <Loading :animation="false">
                    <div
                        v-if="website.states?.data?.dns?.dnssec"
                        class="flex items-center"
                    >
                        <Tooltip :text="'DNSSEC'">
                            <BadgeCheckIcon class="w-4 h-4 text-neutral" />
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
                website.states?.scores?.security?.score === 'warning'
                    ? ' ring-warning'
                    : website.states?.scores?.security?.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral'
            "
        >
            <h3 class="p-1 italic select-none">
                {{ extension.methods.i18n('security') }}
            </h3>

            <Loading>
                <Security />
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
    import { StoreSettingsKey } from '../types/store/settings'
    import { StoreWebsiteKey } from '../types/store/website'
    import Loading from '../components/Loading.vue'
    import Tooltip from '../components/Tooltip.vue'
    import Domain from './infos/Domain.vue'
    import Security from './infos/Security.vue'
    export default defineComponent({
        name: 'Infos',
        components: {
            Loading,
            Tooltip,
            Domain,
            Security,
            BadgeCheckIcon,
            EyeOffIcon,
            RefreshIcon,
        },
        setup() {
            const extension = inject(StoreExtensionKey)
            const settings = inject(StoreSettingsKey)
            const website = inject(StoreWebsiteKey)
            return { extension, settings, website }
        },
    })
</script>
