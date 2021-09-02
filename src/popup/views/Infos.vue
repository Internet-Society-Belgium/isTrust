<template>
    <div class="">
        <div v-if="!website.states.internal">
            {{ JSON.stringify(website.states.data, null, 2) }}
        </div>

        <button v-if="settings.states.dev" @click="website.methods.refresh">
            refresh
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    export default defineComponent({
        name: 'Home',
        setup() {
            const extension = inject('extension')
            const settings = inject('settings')
            const website = inject('website')
            return { extension, settings, website }
        },
    })
</script>
