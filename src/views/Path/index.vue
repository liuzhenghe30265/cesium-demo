<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
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

    const data = require('./mock.json')
    const color = new Cesium.Color.fromCssColorString('#17E980')
    const positions = []
    for (let index = 0; index < data.length; index++) {
      const point = data[index]
      positions.push(point.longitude)
      positions.push(point.latitude)
      positions.push(point.altitude)
    }
    viewer.entities.add({
      polyline: {
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        material: color,
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color
        }),
        width: 5
      }
    })
  },
  methods: {}
}
</script>

<style></style>
