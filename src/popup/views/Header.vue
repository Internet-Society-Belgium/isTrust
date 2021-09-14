<template>
    <div class="flex justify-center pointer-events-none select-none">
        <div class="flex items-center gap-2">
            <img src="../../../assets/icons/icon.svg" alt="" class="w-6 h-6" />
            <h1 class="text-base text-center font-semibold whitespace-nowrap">
                {{ extension.methods.i18n('extension_name') }}
            </h1>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { StoreExtensionKey } from '../types/store/extension'
    export default defineComponent({
        name: 'Header',
        setup() {
            const extension = inject(StoreExtensionKey)
            return { extension }
        },
    })
</script>
