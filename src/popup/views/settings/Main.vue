<template>
    <div class="m-2 bg-container rounded-lg">
        <div class="grid grid-flow-row gap-2 p-3">
            <div class="flex items-center">
                <div class="flex-none">
                    <MoonIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">Dark mode</p>
                <div
                    class="w-10 h-5 flex items-center rounded-full px-1"
                    :class="settings.states.dark ? 'bg-primary' : 'bg-neutral'"
                    @click="settings.methods.toggleDark"
                >
                    <div
                        class="
                            bg-background
                            w-3
                            h-3
                            rounded-full
                            shadow-md
                            transform
                        "
                        :class="{ 'translate-x-5': settings.states.dark }"
                    ></div>
                </div>
            </div>

            <a class="flex items-center" href="#">
                <div class="flex-none">
                    <HeartIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">Feedback</p>
                <div class="flex-none">
                    <ExternalLinkIcon class="w-5 h-5 text-neutral" />
                </div>
            </a>

            <router-link
                to="/settings/more"
                tag="div"
                class="flex items-center"
            >
                <div class="flex-none">
                    <PlusIcon class="w-6 h-6 text-neutral" />
                </div>
                <p class="flex-grow pl-1 pr-6 whitespace-nowrap">More infos</p>
                <div class="flex-none">
                    <ChevronRightIcon class="w-5 h-5 text-neutral" />
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        ExternalLinkIcon,
        MoonIcon,
        ChevronRightIcon,
        HeartIcon,
        PlusIcon,
    } from '@heroicons/vue/outline'
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../../types/store/settings'
    export default defineComponent({
        name: 'SettingsMain',
        components: {
            ExternalLinkIcon,
            MoonIcon,
            ChevronRightIcon,
            HeartIcon,
            PlusIcon,
        },
        setup() {
            const settings = inject(StoreSettingsKey)
            return { settings }
        },
    })
</script>
