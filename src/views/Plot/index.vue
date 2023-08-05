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
/* eslint-disable new-cap */
import PlotUtil from '@/utils/CesiumUtils/Plot/index.js'
export default {
  data () {
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
        }
        // {
        //   name: 'text'
        // }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted () {
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
    DecryptPlotData (data) {
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
    addGraphic (data) {
      if (data.drawingMode === 'point') {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(data.centerPoint.longitude, data.centerPoint.latitude, data.centerPoint.altitude),
          point: {
            color: new Cesium.Color.fromCssColorString('#17E980'),
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 30000.0),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 1.0, 0.7e4, 0.8),
            pixelSize: 14,
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString('#fff')
          },
          label: {
            text: `经度：${data.centerPoint.longitude}\n纬度：${data.centerPoint.latitude}\n海拔：${data.centerPoint.altitude}`,
            font: '30px sans-serif',
            // pixelOffset: new Cesium.Cartesian2(0.0, 45.0),
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            fillColor: Cesium.Color.fromCssColorString('#fff'),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString('#000'),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 30000.0),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
          }
        })
      } else if (data.drawingMode === 'polyline') {
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(data.centerPoint.longitude, data.centerPoint.latitude, data.centerPoint.altitude),
          label: {
            text: `${data.activeShapeComputed}m`,
            font: '30px sans-serif',
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            fillColor: Cesium.Color.fromCssColorString('#fff'),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString('#000'),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 30000.0),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
          }
        })
        if (data.activeSubLine && data.activeSubLine.length > 0) {
          const _polylineColor = Cesium.Color.fromCssColorString('#17E980')
          data.activeSubLine.map((line, lineIndex) => {
            if (line.distance <= 0) return
            const positions = Cesium.Cartesian3.fromDegreesArrayHeights(
              [
                line.start.longitude, line.start.latitude, line.start.altitude,
                line.end.longitude, line.end.latitude, line.end.altitude
              ]
            )
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(line.centerPoint.longitude, line.centerPoint.latitude, line.centerPoint.altitude),
              polyline: {
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                positions: positions,
                material: _polylineColor,
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                  _polylineColor
                }),
                width: 5
              },
              label: {
                text: `${line.distance}米`,
                font: '30px sans-serif',
                fillColor: Cesium.Color.fromCssColorString('#fff'),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.fromCssColorString('#000'),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 30000.0),
                scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
              }
            })
          })
        }
      } else if (data.drawingMode === 'polygon') {
        const vertices = data.verticesPosition || data.activeShapePoints || []
        const _hierarchy = []
        if (vertices.length > 0) {
          vertices.map(point => {
            _hierarchy.push(Cesium.Cartesian3.fromDegrees(
              point.longitude,
              point.latitude,
              point.altitude
            ))
          })
        }
        if (_hierarchy.length > 0) {
          const dynamicPositions = new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy(_hierarchy)
          }, false) // 使贴地多边形在模型上有立体效果
          const center = data.centerPoint
          const altitudes = vertices.map(_ => _.altitude)
          const max = altitudes.sort()[altitudes.length - 1]
          center.altitude = max
          const polygonColor = Cesium.Color.fromCssColorString('#17E980')
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(data.centerPoint.longitude, data.centerPoint.latitude, data.centerPoint.altitude),
            polygon: {
              // hierarchy: hierarchy,
              hierarchy: dynamicPositions,
              // extrudedHeight: 200,
              // perPositionHeight: true,
              // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              material: new Cesium.ColorMaterialProperty(
                polygonColor
              )
            },
            label: {
              text: `${data.activeShapeComputed}平方米`,
              font: '30px sans-serif',
              fillColor: Cesium.Color.fromCssColorString('#fff'),
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              outlineColor: Cesium.Color.fromCssColorString('#000'),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              // eyeOffset: new Cesium.Cartesian3(0, 0, -10000),
              // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10000.0),
              scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
            }
          })
        }
      } else if (data.drawingMode === 'text') {
        const _fillColor = Cesium.Color.fromCssColorString('#17E980')
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(data.centerPoint.longitude, data.centerPoint.latitude, data.centerPoint.altitude),
          label: {
            text: text,
            font: _font,
            fillColor: _fillColor,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 30000.0),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
            show: visible
          }
        })
      }
    },
    initPlotUtil () {
      const _this = this
      this.$PlotUtil = new PlotUtil({
        defaultColorValue: '#17E980',
        PlottingStatus: function (value) {
          console.log('..................PlottingStatus', value)
        },
        Finish: function (data) {
          console.log('..................Finish', data)
          _this.addGraphic(data)
        },
        VerticesFinish: function (data) {
          console.log('..................VerticesFinish', data)
        },
        CurrentEditVertice: function (data) {
          console.log('..................CurrentEditVertice', data)
        }
      })
    },
    handleClick (item) {
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
