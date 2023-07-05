<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%"
  >
    <div class="btns">
      <div class="ul">
        <div
          v-for="(item, index) of btns"
          :key="index"
          class="li"
          :class="{active: item.name === active}"
          @click="handleClick(item)"
        >
          {{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PlotUtil from '@/utils/CesiumUtils/Plot/index.js'
export default {
  data() {
    return {
      $PlotUtil: null,
      active: '',
      btns: [
        {
          name: 'point'
        },
        {
          name: 'polyline'
        },
        {
          name: 'polygon'
        },
        {
          name: 'text'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    const tileset = new Cesium.Cesium3DTileset({
      url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    this.initPlotUtil()
  },
  methods: {
    initPlotUtil() {
      this.$PlotUtil = new PlotUtil({
        defaultColorValue: '#FF000080',
        PlottingStatus: function (value) {
          console.log('..................PlottingStatus', value)
        },
        Finish: function (data) {
          console.log('..................Finish', data)
        },
        VerticesFinish: function (data) {
          console.log('..................VerticesFinish', data)
        },
        CurrentEditVertice: function (data) {
          console.log('..................CurrentEditVertice', data)
        }
      })
    },
    handleClick(item) {
      this.active =
        this.active === item.name
          ? (this.active = '')
          : (this.active = item.name)
      if (this.active) {
        this.$PlotUtil.StartPlot(this.active)
      } else {
        this.$PlotUtil.Destory()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btns {
  position: absolute;
  right: 50px;
  top: 100px;
  z-index: 999;
  .ul {
    .li {
      cursor: pointer;
      &.active {
        color: red;
      }
    }
  }
}
</style>
