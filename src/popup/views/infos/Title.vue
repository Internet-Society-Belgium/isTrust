<template>
    <div v-if="!website.states.internal" class="px-6">
        <Loading>
            <h2
                v-if="website.states.data?.url"
                class="whitespace-nowrap text-center text-lg text-secondary dark:text-dark-secondary"
            >
                <i
                    v-if="
                        website.states.data.url.subdomain !== null &&
                        website.states.data.url.subdomain !== 'www'
                    "
                >
                    {{ `${website.states.data.url.subdomain}.` }}
                </i>
                <b>
                    {{ website.states.data.url.domain || '' }}
                </b>
            </h2>
        </Loading>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'

    import { StoreWebsiteKey } from '../../types/store/website'

    import Loading from '../../components/Loading.vue'

    export default defineComponent({
        name: 'Title',
        components: { Loading },
        setup() {
            const website = inject(StoreWebsiteKey)
            if (!website) {
                throw new Error(
                    `Could not resolve ${StoreWebsiteKey.description}`
                )
            }
            return { website }
        },
    })
</script>
