<template>
    <div class="text-center p-2">
        <Loading>
            <div v-if="website.states.internal">
                <h2 class="text-lg">
                    {{ extension.i18n('internal') }}
                </h2>
            </div>
            <div v-else-if="!website.states.loading">
                <h2 class="text-lg">
                    {{ website.states.data.domain }}
                </h2>
            </div>
        </Loading>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import Loading from '../components/Loading.vue'
    export default defineComponent({
        name: 'Header',
        components: { Loading },
        setup() {
            const extension = inject('extension')
            const website = inject('website')
            return { website, extension }
        },
    })
</script>
