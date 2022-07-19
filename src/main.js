import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

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
      }).$mount("#app");
  }
  // 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
  XE.ready().then(startup);
} else if (typeof Cesium !== "undefined") {
  // 如果XE不存在，存在Cesium，则此时用纯Cesium进行开发
  new Vue({
      render: h => h(App),
      router,
      store
  }).$mount("#app");
}