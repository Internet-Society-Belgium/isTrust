<template>
    <div :class="settings.states.dark ? 'dark' : ''">
        <div
            class="
                bg-background
                dark:bg-dark-background
                text-secondary
                dark:text-dark-secondary
            "
        >
            <div class="p-2 flex flex-col gap-3 min-w-40">
                <div>
                    <Header />
                </div>
                <div>
                    <router-view v-slot="{ Component }">
                        <ViewTransition
                            :transition="toChild ? 'scale' : ''"
                            :mode="toChild ? 'out-in' : ''"
                        >
                            <component :is="Component" />
                        </ViewTransition>
                    </router-view>
                </div>
                <div>
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
    export default defineComponent({
        name: 'Home',
        components: { Header, Footer, ViewTransition },
        setup() {
            const settings = inject(StoreSettingsKey)
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
