
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

<style>
* {
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
</style>
<style lang="scss" scoped>
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
</style>
