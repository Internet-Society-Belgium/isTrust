<template>
    <div class="p-2 flex flex-col gap-3 min-w-40">
        <div>
            <Header />
        </div>
        <div>
            <router-view v-slot="{ Component }">
                <transition name="scale" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
        <div>
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Footer from './Footer.vue'
    import Header from './Header.vue'
    export default defineComponent({
        name: 'Home',
        components: {
            Header,
            Footer,
        },
    })
</script>

<style>
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
