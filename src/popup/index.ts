import { createApp } from 'vue'

import App from './views/App.vue'

import router from './router'
import './styles/index.css'

createApp(App).use(router).mount('#app')
