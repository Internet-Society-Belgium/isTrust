import { createApp } from 'vue'

import reportBug from './utils/bug'

import App from './views/App.vue'

import router from './router'
import './styles/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

app.config.errorHandler = async (error) => {
    await reportBug({ type: 'popup', data: error })
}
