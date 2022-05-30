import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Init',
    component: () => import('../views/Init.vue')
  },
  {
    path: '/Entity',
    name: 'Entity',
    component: () => import('../views/Entity.vue')
  },
  {
    path: '/Model',
    name: 'Model',
    component: () => import('../views/Model.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
