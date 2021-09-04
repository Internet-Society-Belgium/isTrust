<template>
    <div class="w-40">
        <div>
            <Header />
        </div>
        <div class="">
            <router-view></router-view>
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
        name: 'App',
        components: {
            Header,
            Footer,
        },
    })
</script>
