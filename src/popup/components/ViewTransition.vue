<template>
    <transition
        :name="transition"
        :mode="
            mode === 'in-out'
                ? 'in-out'
                : mode === 'out-in'
                ? 'out-in'
                : 'default'
        "
    >
        <slot />
    </transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'ViewTransition',
        props: {
            transition: {
                type: String,
                required: true,
            },
            mode: {
                type: String,
                validator(value: string) {
                    return ['default', 'in-out', 'out-in'].includes(value)
                },
                default: 'default',
                required: false,
            },
        },
    })
</script>

<style scoped>
    .scale-enter-active,
    .scale-leave-active {
        transition: all 0.5s ease-in-out;
    }
    .scale-enter-from,
    .scale-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: all 0.5s ease-in-out;
    }

    .slide-left-enter-from {
        transform: translateX(120%);
    }
    .slide-left-enter-to {
        transform: translateX(0);
    }
    .slide-left-leave-from {
        transform: translateX(0);
    }
    .slide-left-leave-to {
        transform: translateX(-120%);
    }

    .slide-right-enter-from {
        transform: translateX(-120%);
    }
    .slide-right-enter-to {
        transform: translateX(0);
    }
    .slide-right-leave-from {
        transform: translateX(0);
    }
    .slide-right-leave-to {
        transform: translateX(120%);
    }
</style>
