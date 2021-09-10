import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Infos from '../views/Infos.vue'
import Settings from '../views/Settings.vue'
import SettingsMain from '../views/settings/Main.vue'
import SettingsMore from '../views/settings/More.vue'

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
                children: [
                    {
                        path: '',
                        name: 'SettingsMain',
                        component: SettingsMain,
                    },
                    {
                        path: 'more',
                        name: 'SettingsMore',
                        component: SettingsMore,
                    },
                ],
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory('popup'),
    routes,
})

export default router
