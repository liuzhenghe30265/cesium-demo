import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '初始化',
    visible: true,
    component: () => import('../views/Init.vue')
  },
  {
    path: '/Entity',
    name: '实体',
    visible: true,
    component: () => import('../views/Entity.vue')
  },
  {
    path: '/Primitive',
    name: 'Primitive',
    visible: true,
    component: () => import('../views/Primitive')
  },
  {
    path: '/Primitive/get',
    name: '操作Primitive',
    visible: true,
    component: () => import('../views/Primitive/get.vue')
  },
  {
    path: '/Primitive/PrimitiveCollection',
    name: 'PrimitiveCollection',
    visible: true,
    component: () => import('../views/Primitive/PrimitiveCollection.vue')
  },
  {
    path: '/Model',
    name: '模型',
    visible: true,
    component: () => import('../views/Model.vue')
  },
  {
    path: '/ClippingPlane',
    name: '模型切割',
    visible: true,
    component: () => import('../views/ClippingPlane.vue')
  },
  {
    path: '/Path',
    name: '轨迹',
    visible: false,
    component: () => import('../views/Path.vue')
  },
  {
    path: '/EarthSdk',
    name: 'EarthSdk',
    visible: true,
    component: () => import('../views/EarthSdk.vue')
  },
  {
    path: '/Three',
    name: 'ThreeJS',
    visible: true,
    component: () => import('../views/Three')
  },
  {
    path: '/Three2',
    name: 'ThreeJSHushi',
    visible: false,
    component: () => import('../views/Three/index2.vue')
  },
  {
    path: '/Boom',
    name: 'Three炸裂',
    visible: true,
    component: () => import('../views/Three/Boom.vue')
  },
  {
    path: '/RoutePlanning',
    name: '航线规划',
    visible: false,
    component: () => import('../views/RoutePlanning')
  },
  {
    path: '/Preview',
    name: '任务预览',
    visible: true,
    component: () => import('../views/RoutePlanning/Preview')
  },
  {
    path: '/WebControl',
    name: 'WebControl',
    visible: true,
    component: () => import('../views/WebControl')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
