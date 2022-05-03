<template>
    <div v-if="disable">
        <slot />
    </div>
    <div v-else class="relative">
        <div @mouseenter="open" @mouseleave="close">
            <slot />
        </div>
        <transition name="fade">
            <div
                v-if="isOpen"
                class="absolute bottom-full z-10 my-2 rounded-lg bg-secondary-container py-1 px-2 text-center text-sm text-secondary transition duration-500 dark:bg-secondary-dark-container dark:text-dark-secondary"
            >
                <span class="select-none">{{ text }}</span>
                <svg
                    class="absolute left-0 ml-1 h-2 text-secondary-container dark:text-secondary-dark-container"
                    style="top: 95%"
                    viewBox="0 0 255 127.5"
                    fill="currentColor"
                >
                    <polygon points="0,0 127.5,127.5 255,0" />
                </svg>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'Tooltip',
        props: {
            disable: {
                type: Boolean,
                default: false,
                required: false,
            },
            text: {
                type: String,
                required: true,
            },
        },
        setup() {
            const isOpen = ref(false)
            const open = () => {
                isOpen.value = true
            }
            const close = () => {
                isOpen.value = false
            }
            return { isOpen, open, close }
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
