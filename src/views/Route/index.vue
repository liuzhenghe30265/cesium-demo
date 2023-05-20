<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    />
    <div class="ul">
      <div
        v-for="(item, index) of list"
        :key="index"
        class="li"
        :class="{active: item.name === active}"
        @click="handleClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
import {
  AddRouteGraphic,
  ClearRouteGraphic
} from '@/utils/CesiumUtils/DrawRoute'
import routes from './routes.json'
export default {
  data() {
    return {
      active: '',
      list: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    this.list = routes
  },
  methods: {
    handleClick(item) {
      this.active = item.name
      ClearRouteGraphic('Route')
      AddRouteGraphic({
        id: 'Route', // 航线所有元素 ID 前缀（用于多处绘制/清除航线）
        list: item.list, // 航点数据
        indexReverse: false,
        color: '#ff0000',
        lineVisible: true,
        pointVisible: true,
        altitudeVisible: true,
        distanceVisible: true,
        planeTimeVisible: true,
        fly: true // 是否定位到航线处
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ul {
  position: fixed;
  left: 50px;
  top: 100px;
  .li {
    padding: 10px 0;
    cursor: pointer;
    color: #fff;
    &.active {
      color: red;
    }
  }
}
</style>