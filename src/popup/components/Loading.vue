<template>
    <transition name="fade" mode="out-in">
        <div v-if="website.states.loading">
            <div v-if="animation" class="flex justify-center p-2">
                <div class="h-3 w-3 animate-ping rounded-full bg-primary"></div>
                <div class="absolute h-3 w-3 rounded-full bg-primary"></div>
            </div>
        </div>
        <div v-else>
            <slot />
        </div>
    </transition>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'

    import { StoreWebsiteKey } from '../types/store/website'

    export default defineComponent({
        name: 'Loading',
        props: {
            animation: {
                type: Boolean,
                default: true,
                required: false,
            },
        },
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

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.6s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
