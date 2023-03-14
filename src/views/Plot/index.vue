<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%"
  />
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils.js'
import '@/utils/dynamicWallMaterialProperty'
import { flattenDeep } from 'lodash'
export default {
  data() {
    return {}
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

    const list = []
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const ray1 = viewer.camera.getPickRay(event.position)
      const cartesian = viewer.scene.globe.pick(ray1, viewer.scene)
      const pick = viewer.scene.pickPosition(event.position)
      const pickModel = viewer.scene.pick(event.position)
      let earthPosition = null
      if (pick && pickModel && !pickModel.id) {
        earthPosition = pick
      } else {
        earthPosition = cartesian
      }
      if (!earthPosition) {
        return
      }
      list.push(cartesianToLongAndLat(earthPosition))
      console.log('.............list', list)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    const data = require('./mock.json')
    data.map(async item => {
      if (item.objectInfo && item.objectInfo.drawingMode === 'polygon') {
        const positions = []
        const hierarchy = []
        const minimumHeights = []
        const points = item.objectInfo.activeShapePoints
        points.map(point => {
          const Cartesian3 = Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          )
          hierarchy.push(Cartesian3)
          positions.push(point.longitude)
          positions.push(point.latitude)
          minimumHeights.push(point.altitude)
          // 顶点
          // viewer.entities.add({
          //   name: 'plotGraphic',
          //   position: Cartesian3,
          //   point: {
          //     color: Cesium.Color.YELLOW,
          //     pixelSize: 10
          //   }
          // })
        })
        positions.push(points[0].longitude)
        positions.push(points[0].latitude)
        minimumHeights.push(points[0].altitude)
        const maximumHeights = minimumHeights.map(_ => _ + 100)
        viewer.entities.add({
          name: 'plotGraphic',
          polygon: {
            hierarchy: hierarchy,
            // extrudedHeight: 200,
            // perPositionHeight: true,
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            material: Cesium.Color.RED.withAlpha(0.4)
          }
        })
        // viewer.entities.add({
        //   wall: {
        //     positions: Cesium.Cartesian3.fromDegreesArray(positions),
        //     maximumHeights: maximumHeights,
        //     minimumHeights: minimumHeights,
        //     material: Cesium.Color.BLUE.withAlpha(0.3)
        //     // material: new Cesium.DynamicWallMaterialProperty({
        //     //   color: Cesium.Color.fromCssColorString('#E93417FF'),
        //     //   trailImage: require('@/assets/images/colors.png'),
        //     //   duration: 1000
        //     // })
        //   }
        // })

        // 用 sampleTerrainMostDetailed 在每条边上生成若干个点，绘制 wall，实现高低起伏的效果
        const lineArray = []
        for (let index = 0; index < points.length; index++) {
          const element1 = points[index]
          const element2 = points[index + 1]
          if (element1 && element2) {
            lineArray.push([element1, element2])
          }
        }
        lineArray.push([points[points.length - 1], points[0]])
        return Promise.all(
          lineArray.map(point => {
            return new Promise(resolve => {
              const start = Cesium.Cartesian3.fromDegrees(
                point[0].longitude,
                point[0].latitude,
                point[0].altitude
              )
              const end = Cesium.Cartesian3.fromDegrees(
                point[1].longitude,
                point[1].latitude,
                point[1].altitude
              )
              const positions2 = [Cesium.Cartographic.fromCartesian(start)]
              // 插值 100 个点
              const count = 1000
              for (let i = 1; i < count; i++) {
                const cart = Cesium.Cartesian3.lerp(
                  start,
                  end,
                  i / count,
                  new Cesium.Cartesian3()
                )
                positions2.push(Cesium.Cartographic.fromCartesian(cart))
              }
              positions2.push(Cesium.Cartographic.fromCartesian(end))

              const promise = Cesium.sampleTerrainMostDetailed(
                Cesium.createWorldTerrain(),
                positions2
              )
              Promise.resolve(promise).then(function (updatedPositions) {
                const result = updatedPositions.map(_ => {
                  return {
                    longitude: Cesium.Math.toDegrees(_.longitude),
                    latitude: Cesium.Math.toDegrees(_.latitude),
                    altitude: _.height
                  }
                })
                resolve(result)
              })
            })
          })
        ).then(res => {
          const positions = []
          const _res = flattenDeep(res)
          _res.map(point => {
            positions.push(point.longitude)
            positions.push(point.latitude)
          })
          const minimumHeights = _res.map(_ => _.altitude)
          const maximumHeights = minimumHeights.map(_ => _ + 40)
          viewer.entities.add({
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArray(positions),
              maximumHeights: maximumHeights,
              minimumHeights: minimumHeights,
              material: Cesium.Color.BLUE.withAlpha(0.5)
            }
          })
        })
      }
    })
  },
  methods: {}
}
</script>

<style>
</style>
