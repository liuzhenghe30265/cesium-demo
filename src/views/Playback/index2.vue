<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

  <script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
// import {
//   getExtend
// } from '@/utils/CesiumUtils/common.js'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    const data = require('./points3.json')
    console.log('..................data', data)

    const modelEntity = viewer.entities.add({
      name: 'glb 模型',
      position: new Cesium.Cartesian3.fromDegrees(117.7136688, 39.0772171, 10),
      model: {
        uri: 'model/Cesium_Air.glb',
        minimumPixelSize: 50
        // maxumunScale: 2000
      }
    })
    modelEntity.model.clippingPlanes = new Cesium.ClippingPlaneCollection({
      planes: [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, 1.0), -3), // 上
        // new Cesium.ClippingPlane(
        //   new Cesium.Cartesian3(0.0, 0.0, -1.0),
        //   0.0
        // ), // 下
        new Cesium.ClippingPlane(new Cesium.Cartesian3(1.2, -1.6, 0.0), 10), // 左
        new Cesium.ClippingPlane(new Cesium.Cartesian3(-0.5, 0.65, 0.0), 455.0), // 右
        new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.3, -1.0, 0.0), 100.0), // 后
        new Cesium.ClippingPlane(new Cesium.Cartesian3(1.3, 1.0, 0.0), 340.0) // 前
      ],
      unionClippingRegions: true
    })
    console.log(
      '...............modelEntity',
      modelEntity,
      '0000000000000',
      modelEntity.model.clippingPlanes.getValue(viewer.clock.currentTime)
    )
    viewer.flyTo(modelEntity)

    setTimeout(() => {
      let index = 0
      setInterval(() => {
        index += 1
        const obj = data[index]
        if (!obj) return
        const position = new Cesium.Cartesian3.fromDegrees(
          obj.longitude,
          obj.latitude,
          obj.altitude
        )
        modelEntity.position.setValue(position)
      }, 0)
    }, 5000)
  },
  methods: {}
}
</script>

<style>
</style>
