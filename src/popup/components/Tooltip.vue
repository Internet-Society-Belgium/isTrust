<template>
    <div class="group relative inline-block">
        <slot />
        <div
            class="
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
                absolute
                text-secondary
                dark:text-dark-secondary
                text-center
                bg-secondary-container
                dark:bg-secondary-dark-container
                rounded-lg
                py-1
                px-2
                -top-8
                -left-6
                z-10
            "
        >
            <span class="text">{{ text }}</span>
            <svg
                class="
                    absolute
                    text-secondary-container
                    dark:text-secondary-dark-container
                    h-2
                    left-0
                    w-full
                    top-full
                "
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
                xml:space="preserve"
            >
                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
            </svg>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'Tooltip',
        props: {
            text: {
                type: String,
                required: true,
            },
        },
    })
</script>
