import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Init',
    component: () => import('../views/Init.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
