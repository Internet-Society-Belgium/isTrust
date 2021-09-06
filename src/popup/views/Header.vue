<template>
    <div class="text-center m-5">
        <div v-if="website.states.internal || !website.states.empty">
            <h2 class="text-lg">
                {{
                    website.states.internal
                        ? extension.i18n('internal')
                        : website.states.data.domain
                }}
            </h2>
        </div>
        <div v-else>
            <div class="bg-loading rounded-full animate-pulse w-auto h-5"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    export default defineComponent({
        name: 'Header',
        setup() {
            const extension = inject('extension')
            const website = inject('website')
            return { website, extension }
        },
    })
</script>
