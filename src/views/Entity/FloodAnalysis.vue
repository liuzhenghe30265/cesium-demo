<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <span
      id="button"
      style="position: absolute; right: 50px; top: 50px; z-index: 999; font-size: 24px; color: #fff; cursor: pointer;"
    >淹没分析</span>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
import { lineString, bbox, bboxPolygon, area, pointGrid } from '@turf/turf'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    const tileset = new Cesium.Cesium3DTileset({
      url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    const entity = viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArrayHeights([
            108.95641933453238, 34.22432161641172, 0, 108.96253588703804,
            34.22439761612171, 0, 108.96232768137122, 34.21756975247353, 0,
            108.95619302773214, 34.21776743510424, 0
          ])
        ),
        // extrudedHeight: 200,
        // perPositionHeight: true,
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.Color.fromCssColorString('#17E980').withAlpha(0)
        )
      }
    })

    // 淹没分析
    function FloodAnalysis() {
      const positions = entity.polygon.hierarchy.getValue(
        Cesium.JulianDate.now()
      ).positions
      const tempPoints = []
      for (let i = 0; i < positions.length; i++) {
        const cartographic =
          viewer.scene.globe.ellipsoid.cartesianToCartographic(positions[i])
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const lng = Cesium.Math.toDegrees(cartographic.longitude)
        tempPoints.push([lng, lat])
      }
      // 生成外接矩形
      const line = lineString(tempPoints)
      const _bbox = bbox(line)
      const _bboxPolygon = bboxPolygon(_bbox)
      const _area = area(_bboxPolygon)
      // 生成格网
      // 计算网格点之间的距离，尽量保证范围内有1万个左右格网点。
      const cellSide = Math.sqrt(_area / 1000000) / 100
      const options = { units: 'kilometers' }
      const grid = pointGrid(_bbox, cellSide, options)
      const gridPositions = []
      grid.features.forEach(f => {
        gridPositions.push(
          Cesium.Cartographic.fromDegrees(
            f.geometry.coordinates[0],
            f.geometry.coordinates[1]
          )
        )
      })
      const promise = Cesium.sampleTerrainMostDetailed(
        viewer.terrainProvider,
        gridPositions
      )
      let maxHeight = 460
      let minHeight = 480
      Promise.resolve(promise).then(function (updatedPositions) {
        for (let i = 0; i < updatedPositions.length; i++) {
          const height = updatedPositions[i].height
          // 获取格网点处地形高度
          minHeight = height < minHeight ? height : minHeight
          maxHeight = height > maxHeight ? height : maxHeight
        }
        const value = {
          minHeight,
          maxHeight
        }
        let waterHeight = value.minHeight
        const targertWaterHeight = value.maxHeight
        entity.polygon.perPositionHeight = true
        entity.polygon.material = new Cesium.Color.fromBytes(64, 157, 253, 150)
        entity.polygon.extrudedHeight = new Cesium.CallbackProperty(
          function () {
            waterHeight += 0.5
            if (waterHeight > targertWaterHeight) {
              waterHeight = targertWaterHeight
            }
            return waterHeight
          },
          false
        )
        return value
      })
    }

    document.getElementById('button').onclick = function () {
      FloodAnalysis()
    }
  },
  methods: {}
}
</script>
