<template>
    <div class="text-center">
        <h3 class="text-lg">
            {{
                website.states.internal
                    ? extension.i18n('internal')
                    : website.states.data.domain
            }}
        </h3>
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
