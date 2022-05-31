import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Init',
    visible: true,
    component: () => import('../views/Init.vue')
  },
  {
    path: '/Entity',
    name: 'Entity',
    visible: true,
    component: () => import('../views/Entity.vue')
  },
  {
    path: '/Model',
    name: 'Model',
    visible: true,
    component: () => import('../views/Model.vue')
  },
  {
    path: '/ClippingPlane',
    name: 'ClippingPlane',
    visible: true,
    component: () => import('../views/ClippingPlane.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
