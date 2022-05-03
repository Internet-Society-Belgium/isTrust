<template>
    <div
        class="flex h-full items-center justify-center"
        :class="settings.states.dark ? 'dark' : ''"
    >
        <div
            class="overflow-hidden bg-background dark:bg-dark-background"
            :class="
                settings.transitioning.dark
                    ? 'transition-colors duration-500'
                    : ''
            "
        >
            <div class="flex w-min min-w-40 flex-col gap-3">
                <div class="p-4">
                    <Header />
                </div>

                <div class="p-4">
                    <router-view v-slot="{ Component }">
                        <ViewTransition
                            :transition="toChild ? 'scale' : ''"
                            :mode="toChild ? 'out-in' : 'default'"
                        >
                            <component :is="Component" />
                        </ViewTransition>
                    </router-view>
                </div>

                <div class="p-2">
                    <Footer />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'

    import { StoreSettingsKey } from '../types/store/settings'

    import ViewTransition from '../components/ViewTransition.vue'
    import Footer from './Footer.vue'
    import Header from './Header.vue'
    import Title from './infos/Title.vue'

    export default defineComponent({
        name: 'Home',
        components: { Header, Title, Footer, ViewTransition },
        setup() {
            const settings = inject(StoreSettingsKey)
            if (!settings) {
                throw new Error(
                    `Could not resolve ${StoreSettingsKey.description}`
                )
            }
            const toChild = ref(false)
            const lastRoute = ref('/')
            watch(useRoute(), (route) => {
                toChild.value = lastRoute.value.length !== route.path.length
                lastRoute.value = route.path
            })
            return { settings, toChild }
        },
    })
</script>
