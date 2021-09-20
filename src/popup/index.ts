import { createApp } from 'vue'

import App from './views/App.vue'

import router from './router'
import './styles/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
