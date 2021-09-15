<template>
    <div
        class="w-10 h-5 flex items-center rounded-full px-1"
        :class="active ? 'bg-primary' : 'bg-neutral'"
        @click="$emit('click')"
    >
        <div
            class="
                bg-background
                dark:bg-dark-background
                w-3
                h-3
                rounded-full
                shadow-md
                transform
                transition
                duration-500
            "
            :class="{ 'translate-x-5': active }"
        ></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'Loading',
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
