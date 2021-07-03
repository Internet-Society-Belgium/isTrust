import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'

createApp(App).use(router).use(store).mount('#app')
