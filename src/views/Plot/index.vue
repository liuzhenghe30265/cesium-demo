<template>
  <div id="cesium-container" style="width: 100%; height: 100%">
    <div class="btns">
      <div class="ul">
        <div v-for="(item, index) of btns" :key="index" class="li" :class="{ active: item.name === active }"
          @click="handleClick(item)">
          {{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
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
    // const mock = require('./mock.json')
    // const list = []
    // mock.data.forEach((item, index) => {
    //   const _item = this.DecryptPlotData(item)
    //   list.push({
    //     name: `plot_${index}`,
    //     info: _item.objectInfo
    //   })
    // })

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
    DecryptPlotData(data) {
      if (!data) return
      const _data = JSON.parse(JSON.stringify(data))
      if (_data.objectInfo) {
        try {
          const _obj = JSON.parse(_data.objectInfo)
          if (_obj && typeof _obj === 'object') {
            _data.objectInfo = _obj

            if (_obj.activeShapePoints && _obj.activeShapePoints.length > 0) {
              const _activeShapePoints = _obj.activeShapePoints.map(_ => {
                return {
                  longitude: _.longitude - 180,
                  latitude: _.latitude - 90,
                  altitude: _.altitude
                }
              })
              _obj.activeShapePoints = _activeShapePoints
            }

            if (_obj.verticesPosition && _obj.verticesPosition.length > 0) {
              const _verticesPosition = _obj.verticesPosition.map(_ => {
                return {
                  longitude: _.longitude - 180,
                  latitude: _.latitude - 90,
                  altitude: _.altitude
                }
              })
              _obj.verticesPosition = _verticesPosition
            }

            if (_obj.activeSubLine && _obj.activeSubLine.length > 0) {
              const _activeSubLine = _obj.activeSubLine.map(_ => {
                return {
                  start: {
                    longitude: _.start.longitude - 180,
                    latitude: _.start.latitude - 90,
                    altitude: _.start.altitude
                  },
                  end: {
                    longitude: _.end.longitude - 180,
                    latitude: _.end.latitude - 90,
                    altitude: _.end.altitude
                  },
                  distance: _.distance,
                  centerPoint: {
                    longitude: _.centerPoint.longitude - 180,
                    latitude: _.centerPoint.latitude - 90,
                    altitude: _.centerPoint.altitude
                  }
                }
              })
              _obj.activeSubLine = _activeSubLine
            }

            if (_obj.centerPoint) {
              const _centerPoint = {
                longitude: _obj.centerPoint.longitude - 180,
                latitude: _obj.centerPoint.latitude - 90,
                altitude: _obj.centerPoint.altitude
              }
              _obj.centerPoint = _centerPoint
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
      return _data
    },
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
