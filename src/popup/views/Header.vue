<template>
    <div v-if="website.states.loading || website.states?.data" class="p-2">
        <h2
            v-if="website.states.internal"
            class="
                text-lg text-center
                font-semibold
                whitespace-nowrap
                select-none
            "
        >
            {{ extension.methods.i18n('internal') }}
        </h2>
        <div v-else>
            <Loading>
                <h2
                    v-if="website.states?.data?.url"
                    class="text-lg text-center whitespace-nowrap"
                >
                    <i
                        v-if="
                            website.states?.data?.url?.subdomain !== null &&
                            website.states?.data?.url?.subdomain !== 'www'
                        "
                    >
                        {{ `${website.states?.data?.url?.subdomain}.` }}
                    </i>
                    <b>
                        {{ website.states?.data?.url?.domain || '' }}
                    </b>
                </h2>
            </Loading>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreWebsiteKey } from '../types/store/website'
    import Loading from '../components/Loading.vue'
    export default defineComponent({
        name: 'Header',
        components: { Loading },
        setup() {
            const extension = inject(StoreExtensionKey)
            const website = inject(StoreWebsiteKey)
            return { website, extension }
        },
    })
</script>
