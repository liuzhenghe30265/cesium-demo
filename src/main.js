import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'

import VueWorker from 'vue-worker'
Vue.use(VueWorker)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import TimelineSliderVue from 'timeline-slider-vue'
import 'timeline-slider-vue/lib/timeline-slider-vue.css'
Vue.use(TimelineSliderVue)

import { InitMap } from '@/utils/InitMap.js'
window.$InitMap = InitMap

// new Vue({
//   render: h => h(App),
//   router,
//   store
// }).$mount('#app')

if (typeof XE !== 'undefined') {
  // 如果XE存在，说明EarthSDK已载入
  // eslint-disable-next-line no-console
  // console.log("当前正在使用EarthSDK开发！");
  /* eslint-disable*/
  function startup() {
    new Vue({
      render: h => h(App),
      router,
      store
    }).$mount("#app")
  }
  // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
  XE.ready().then(startup)
} else if (typeof Cesium !== "undefined") {
  // 如果XE不存在，存在Cesium，则此时用纯Cesium进行开发
  new Vue({
    render: h => h(App),
    router,
    store
  }).$mount("#app")
}