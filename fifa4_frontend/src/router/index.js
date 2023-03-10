// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/tab1',
        name: 'Tab1',
        component: () => import('@/views/Tab1.vue'),
      },
      {
        path: '/tab2',
        name: 'Tab2',
        component: () => import('@/views/Tab2.vue'),
      },
      {
        path: '/tab3',
        name: 'Tab3',
        component: () => import('@/views/Tab3.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
