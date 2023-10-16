import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '初始化',
    visible: true,
    component: resolve => require(['@/views/Init.vue'], resolve)
  },
  {
    path: '/Entity',
    name: '实体',
    visible: true,
    component: resolve => require(['@/views/Entity'], resolve)
  },
  {
    path: '/WallMaterial',
    name: '动态光墙效果',
    visible: true,
    component: resolve => require(['@/views/Entity/WallMaterial'], resolve)
  },
  {
    path: '/FloodAnalysis',
    name: '淹没分析',
    visible: true,
    component: resolve => require(['@/views/Entity/FloodAnalysis'], resolve)
  },
  {
    path: '/DOM',
    name: 'DOM',
    visible: true,
    component: resolve => require(['@/views/DOM'], resolve)
  },
  {
    path: '/3DTileset',
    name: '3DTileset加载',
    visible: true,
    component: resolve => require(['@/views/3DTileset'], resolve)
  },
  {
    path: '/3DTilesetCompare',
    name: '3DTilesetCompare',
    visible: true,
    component: resolve => require(['@/views/3DTileset/Compare.vue'], resolve)
  },
  {
    path: '/3DTilesetClippingPlane',
    name: '3DTileset切割',
    visible: true,
    component: resolve => require(['@/views/3DTileset/ClippingPlane.vue'], resolve)
  },
  {
    path: '/WMS',
    name: 'WMS',
    visible: true,
    component: resolve => require(['@/views/WMS'], resolve)
  },
  {
    path: '/WMS/Query',
    name: 'WMS Query',
    visible: true,
    component: resolve => require(['@/views/WMS/Query'], resolve)
  },
  {
    path: '/Plot',
    name: '标绘',
    visible: true,
    component: resolve => require(['@/views/Plot'], resolve)
  },
  {
    path: '/Primitive',
    name: 'Primitive',
    visible: true,
    component: resolve => require(['@/views/Primitive'], resolve)
  },
  {
    path: '/Primitive/Route',
    name: 'Primitive 航线',
    visible: true,
    component: resolve => require(['@/views/Primitive/route'], resolve)
  },
  {
    path: '/Primitive/Plot',
    name: 'Primitive Plot',
    visible: true,
    component: resolve => require(['@/views/Primitive/plot.vue'], resolve)
  },
  {
    path: '/Primitive/get',
    name: 'Primitive 拾取',
    visible: true,
    component: resolve => require(['@/views/Primitive/get.vue'], resolve)
  },
  {
    path: '/Primitive/PrimitiveCollection',
    name: 'PrimitiveCollection',
    visible: true,
    component: resolve => require(['@/views/Primitive/PrimitiveCollection.vue'], resolve)
  },
  {
    path: '/Primitive/Model',
    name: 'PrimitiveModel',
    visible: true,
    component: resolve => require(['@/views/Primitive/model.vue'], resolve)
  },
  {
    path: '/FirePoint',
    name: '着火点',
    visible: true,
    component: resolve => require(['@/views/Primitive/FirePoint'], resolve)
  },
  {
    path: '/Video',
    name: 'Video',
    visible: false,
    component: resolve => require(['@/views/Video'], resolve)
  },
  {
    path: '/Path',
    name: '轨迹',
    visible: false,
    component: resolve => require(['@/views/Path'], resolve)
  },
  {
    path: '/EarthSdk',
    name: 'EarthSdk',
    visible: false,
    component: resolve => require(['@/views/EarthSdk'], resolve)
  },
  {
    path: '/ThreeJS',
    name: 'ThreeJS',
    visible: true,
    component: resolve => require(['@/views/Three'], resolve)
  },
  {
    path: '/ThreeJSBoom',
    name: 'Three炸裂',
    visible: true,
    component: resolve => require(['@/views/Three/Boom.vue'], resolve)
  },
  {
    path: '/Playback',
    name: '轨迹播放',
    visible: false,
    component: resolve => require(['@/views/Playback'], resolve)
  },
  {
    path: '/Playback2',
    name: '轨迹播放2',
    visible: false,
    component: resolve => require(['@/views/Playback/index2.vue'], resolve)
  },
  {
    path: '/WebControl',
    name: 'WebControl',
    visible: false,
    component: resolve => require(['@/views/WebControl'], resolve)
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
