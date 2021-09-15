<template>
    <div v-if="!website.states.internal" class="px-6">
        <Loading>
            <h2
                v-if="website.states?.data?.url"
                class="
                    text-lg text-center text-secondary
                    dark:text-dark-secondary
                    transition-colors
                    duration-500
                    whitespace-nowrap
                "
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
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../types/store/extension'
    import { StoreWebsiteKey } from '../types/store/website'
    import Loading from '../components/Loading.vue'
    export default defineComponent({
        name: 'Title',
        components: { Loading },
        setup() {
            const extension = inject(StoreExtensionKey)
            const website = inject(StoreWebsiteKey)
            return { website, extension }
        },
    })
</script>
