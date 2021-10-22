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
                class="
                    absolute
                    transition
                    duration-500
                    text-secondary
                    dark:text-dark-secondary
                    text-center
                    bg-secondary-container
                    dark:bg-secondary-dark-container
                    rounded-lg
                    bottom-full
                    py-1
                    px-2
                    my-2
                    z-10
                "
            >
                <span class="select-none">{{ text }}</span>
                <svg
                    class="
                        absolute
                        text-secondary-container
                        dark:text-secondary-dark-container
                        h-2
                        left-0
                        ml-1
                    "
                    style="top: 95%"
                    viewBox="0 0 255 127.5"
                >
                    <polygon
                        class="fill-current"
                        points="0,0 127.5,127.5 255,0"
                    />
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
