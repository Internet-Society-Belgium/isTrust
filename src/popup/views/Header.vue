<template>
    <div class="text-center p-2">
        <Loading>
            <h2 class="text-lg font-semibold">
                {{
                    website.states.internal
                        ? extension.methods.i18n('internal')
                        : website.states?.data?.hostname || ''
                }}
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
        name: 'Header',
        components: { Loading },
        setup() {
            const extension = inject(StoreExtensionKey)
            const website = inject(StoreWebsiteKey)
            return { website, extension }
        },
    })
</script>
