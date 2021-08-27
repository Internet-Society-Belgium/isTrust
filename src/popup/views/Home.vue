<template>
    <div class="home">
        <h1>
            {{
                website.states.internal
                    ? extension.i18n('internal')
                    : website.states.data.domain
            }}
        </h1>
        <div v-if="!website.states.internal">
            {{ JSON.stringify(website.states.data, null, 2) }}
        </div>
        <div>{{ extension.states.chapter.url }}</div>
        <button v-if="settings.states.dev" @click="website.methods.refresh">
            refresh
        </button>
        <router-link to="/settings">Settings</router-link>
    </div>
</template>

<script lang="ts">
    import { inject } from 'vue'

    export default {
        name: 'Home',
        setup() {
            const extension = inject('extension')
            const settings = inject('settings')
            const website = inject('website')
            return {
                extension,
                settings,
                website,
            }
        },
    }
</script>

<style lang="scss"></style>
