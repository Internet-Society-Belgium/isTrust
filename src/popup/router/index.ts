import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Infos from '../views/Infos.vue'
import Settings from '../views/Settings.vue'

const routes = [
    {
        path: '/index.html',
        redirect: '/',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '',
                name: 'Infos',
                component: Infos,
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings,
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory('popup'),
    routes,
})

export default router
