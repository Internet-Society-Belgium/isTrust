<template>
    <transition :name="transition" mode="out-in">
        <slot></slot>
    </transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'ViewTransition',
        props: {
            transition: {
                type: String,
                default: 'scale',
                required: true,
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
        transition: all 0.5s linear;
    }

    .slide-left-enter-from {
        transform: translateX(100%);
    }
    .slide-left-enter-to {
        transform: translateX(0);
    }
    .slide-left-leave-from {
        transform: translateX(0);
    }
    .slide-left-leave-to {
        transform: translateX(-100%);
    }

    .slide-right-enter-from {
        transform: translateX(-100%);
    }
    .slide-right-enter-to {
        transform: translateX(0);
    }
    .slide-right-leave-from {
        transform: translateX(0);
    }
    .slide-right-leave-to {
        transform: translateX(100%);
    }
</style>
