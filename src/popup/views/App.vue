<template>
    <div class="bg-background">
        <router-view />
    </div>
</template>

<script lang="ts">
    import { defineComponent, provide } from 'vue'
    import extension from '../store/extension'
    import settings from '../store/settings'
    import website from '../store/website'
    export default defineComponent({
        name: 'App',
        setup() {
            provide('extension', extension)
            provide('settings', settings)
            provide('website', website)
        },
    })
</script>
