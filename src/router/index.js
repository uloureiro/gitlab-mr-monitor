import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/mrs',
    alias: '/',
    name: 'Merge Requests',
    component: () => import('../components/MergeRequests.vue')
  },
  {
    path: '/tracked',
    name: 'Tracked Projects',
    component: () => import('../components/Tracked.vue')
  },
  {
    path: '/available',
    name: 'Available Projects',
    component: () => import('../components/Available.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
