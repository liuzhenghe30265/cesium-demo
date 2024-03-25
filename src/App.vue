<template>
  <div
    id="app"
    style="width: 100%; height: 100%; position: relative"
  >
    <FloatingBallVue />
    <div
      class="auto_scroll"
      @click="handleTest"
    >
      <div
        ref="newsContent"
        class="scroll_container"
      >
        <div
          v-for="(news, index) in messageList"
          :key="index"
          class="scroll_item"
          :style="scrollStyle(news)"
          v-html="news"
        />
      </div>
    </div>
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
    <ul
      v-if="navVisible"
      class="nav"
    >
      <li
        v-for="(item, index) of visibleRouters"
        :key="index"
      >
        <router-link :to="item.path">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
    <!-- <a href="https://lab.earthsdk.com/model/" target="blank"
      style="position: fixed;left: 0;top: 0;z-index: 999;color: #fff;">
      无法加载 tileset ？
    </a> -->
    <router-view />
  </div>
</template>

<script>
import routes from '@/router/index.js'
export default {
  data() {
    return {
      messageList: [
        '明日气温相比今日不会有太大变化，适宜穿着棉服类衣物。',
        '明日气温相比今日不会有太大变化，适宜穿着棉服类衣物。'
      ],
      lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
      markDate: [], // 做标记的日期
      mask: true,
      date: '2022-06-01'
    }
  },
  computed: {
    scrollStyle() {
      return value => {
        return {
          animation: `marquee ${value.length / 2}s linear infinite`
        }
      }
    },
    navVisible() {
      return this.getQueryVariable('nav') || this.currentMode === 'dev'
    },
    currentMode() {
      return process.env.VUE_APP_CURRENTMODE
    },
    visibleRouters: function () {
      return routes.options.routes.filter(route => {
        return route.visible
      })
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleTest() {
      // this.$PicturePreviewVue(
      //   'https://file.iviewui.com/images/image-demo-1.jpg'
      // )
      this.$PicturePreviewVue({
        url: 'https://file.iviewui.com/images/image-demo-3.jpg',
        urlList: [
          'https://file.iviewui.com/images/image-demo-1.jpg',
          'https://file.iviewui.com/images/image-demo-2.jpg',
          'https://file.iviewui.com/images/image-demo-3.jpg',
          'https://file.iviewui.com/images/image-demo-4.jpg',
          'https://file.iviewui.com/images/image-demo-5.jpg',
          'https://file.iviewui.com/images/image-demo-6.jpg'
        ]
      })
    },
    getQueryVariable(variable) {
      const query = window.location.search.substring(1)
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
          return pair[1]
        }
      }
      return false
    },
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

.auto_scroll {
  overflow: hidden;
  width: 400px;
  border: 1px solid #fff;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 50px;
  z-index: 999;
}

.scroll_container {
  display: flex;
  white-space: nowrap;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}

.nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
  z-index: 999;
  overflow-y: auto;

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
