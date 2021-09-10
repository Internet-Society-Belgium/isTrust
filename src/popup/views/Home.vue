<template>
    <div :class="[settings.states.dark ? 'dark' : '']">
        <div class="bg-background">
            <div class="p-2 flex flex-col gap-3 min-w-40">
                <div>
                    <Header />
                </div>
                <div>
                    <router-view v-slot="{ Component }">
                        <ViewTransition>
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
    import { defineComponent, inject } from 'vue'
    import { StoreSettingsKey } from '../types/store/settings'
    import ViewTransition from '../components/ViewTransition.vue'
    import Footer from './Footer.vue'
    import Header from './Header.vue'
    export default defineComponent({
        name: 'Home',
        components: { Header, Footer, ViewTransition },
        setup() {
            const settings = inject(StoreSettingsKey)
            return { settings }
        },
    })
</script>
