<template>
    <div
        class="flex h-5 w-10 items-center rounded-full px-1 transition-colors duration-500"
        :class="active ? 'bg-primary' : 'bg-neutral'"
        @click="$emit('click')"
    >
        <div
            class="h-3 w-3 transform rounded-full bg-background shadow-md transition duration-500 dark:bg-dark-background"
            :class="{ 'translate-x-5': active }"
        ></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'Switch',
        props: {
            active: {
                type: Boolean,
                default: true,
                required: false,
            },
        },
        emits: ['click'],
    })
</script>
