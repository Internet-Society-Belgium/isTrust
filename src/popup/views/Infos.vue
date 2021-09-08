<template>
    <div
        class="flex flex-col justify-center align-middle gap-2 m-2"
        :class="[
            website.states.internal
                ? 'filter blur-sm pointer-events-none select-none'
                : '',
        ]"
    >
        <section
            class="bg-container rounded-lg p-2 ring-2"
            :class="[
                website.states?.score?.domain?.score === 'warning'
                    ? ' ring-warning'
                    : website.states?.score?.domain?.score === 'ok'
                    ? 'ring-ok'
                    : 'ring-neutral',
            ]"
        >
            <h3 class="p-1 italic">Domain</h3>

            <Loading>
                <Domain />
            </Loading>
        </section>

        <section class="bg-container rounded-lg p-2">
            <h3 class="p-1 italic">Security</h3>

            <Loading>
                <Security />
            </Loading>
        </section>

        <button v-if="settings.states.dev" @click="website.methods.clear">
            clear
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../types/store/settings'
    import { StoreWebsiteKey } from '../types/store/website'
    import Loading from '../components/Loading.vue'
    import Domain from './infos/Domain.vue'
    import Security from './infos/Security.vue'
    export default defineComponent({
        name: 'Infos',
        components: { Loading, Domain, Security },
        setup() {
            const settings = inject(StoreSettingsKey)
            const website = inject(StoreWebsiteKey)
            return { settings, website }
        },
    })
</script>
