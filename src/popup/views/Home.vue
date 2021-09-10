<template>
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
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import ViewTransition from '../components/ViewTransition.vue'
    import Footer from './Footer.vue'
    import Header from './Header.vue'
    export default defineComponent({
        name: 'Home',
        components: { Header, Footer, ViewTransition },
    })
</script>
