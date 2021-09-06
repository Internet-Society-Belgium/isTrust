<template>
    <div
        class="flex flex-col justify-center align-middle gap-2 m-2"
        :class="[website.states.internal ? 'filter blur-sm' : '']"
    >
        <section class="bg-container rounded-lg p-2">
            <h3>Trustability</h3>
            <div v-if="!website.states.empty">
                <p>
                    {{
                        formatDate(
                            website.states.data?.dns?.events.registration
                        )
                    }}
                </p>
            </div>
            <div v-else>
                <div
                    class="bg-loading rounded-full animate-pulse w-auto h-3"
                ></div>
            </div>
        </section>
        <section class="bg-container rounded-lg p-2">
            <h3>Security</h3>
        </section>
        <section class="bg-container rounded-lg p-2">
            <h3>Privacy</h3>
        </section>

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
            const settings = inject('settings')
            const website = inject('website')
            const formatDate = (date: string) => {
                return new Date(date).toLocaleString('en-GB', {
                    dateStyle: 'long',
                })
            }
            return { settings, website, formatDate }
        },
    })
</script>
