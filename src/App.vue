
<template>
  <div
    id="app"
    style="width: 100%; height: 100%; position: relative">
    <div
      class="nav">
      <router-link
        v-for="(item, index) of visibleRouters"
        :key="index"
        :to="item.path">
        {{ item.name }}
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import routes from '@/router/index.js'
export default {
  data () {
    return {}
  },
  computed: {
    visibleRouters: function () {
      return routes.options.routes.filter(route => {
        return route.visible
      })
    }
  },
  watch: {

  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style lang="scss">
* {
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
.nav {
  position: fixed;
  right: 0;
  top: 0;
  padding: 20px;
  z-index: 999;
  a {
    color: #fff;
    margin: 10px;
    &.router-link-exact-active {
      color: red;
    }
  }
}
.btns {
  position: fixed;
  right: 0;
  top: 100px;
  z-index: 999;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  flex-direction: row;
  justify-content: space-between;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  i {
    font-style: normal;
    cursor: pointer;
    &[class^='el-icon'] {
      font-size: 48px;
    }
  }
}
</style>
