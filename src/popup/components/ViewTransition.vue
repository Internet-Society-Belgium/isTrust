<template>
    <transition name="scale" mode="out-in">
        <slot></slot>
    </transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'ViewTransition',
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
</style>
