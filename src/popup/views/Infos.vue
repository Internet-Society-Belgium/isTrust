<template>
    <div class="">
        <div v-if="!website.states.internal">
            {{ JSON.stringify(website.states.data, null, 2) }}
            <button v-if="settings.states.dev" @click="website.methods.refresh">
                refresh
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    export default defineComponent({
        name: 'Home',
        setup() {
            const settings = inject('settings')
            const website = inject('website')
            return { settings, website }
        },
    })
</script>
