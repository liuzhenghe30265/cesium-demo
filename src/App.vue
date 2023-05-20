<template>
  <div
    id="app"
    style="width: 100%; height: 100%; position: relative"
  >
    <!-- <div
      style="position: absolute;width: 100%;left: 0;bottom: 0;z-index: 999;">
      <timeline-slider-vue
        @change="handleChange"
        @input="handleInput">
        <div
          slot="sliderContent"
          slot-scope="scope">
          {{ scope.data }}
        </div>
      </timeline-slider-vue>
    </div> -->
    <div class="nav">
      <router-link
        v-for="(item, index) of visibleRouters"
        :key="index"
        :to="item.path"
      >
        {{ item.name }}
      </router-link>
      <a
        href="https://lab.earthsdk.com/model/"
        target="blank"
      >
        无法加载 tileset ？
      </a>
    </div>
    <router-view />
  </div>
</template>

<script>
import routes from '@/router/index.js'
export default {
  data() {
    return {
      lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
      markDate: [], // 做标记的日期
      mask: true,
      date: '2022-06-01'
    }
  },
  computed: {
    visibleRouters: function () {
      return routes.options.routes.filter(route => {
        return route.visible
      })
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleInput(value, date) {
      console.log('input', value, date)
    },
    handleChange(value, date) {
      console.log('change', value, date)
    }
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
  left: 0;
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
