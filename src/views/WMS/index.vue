<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

  <script>
/* eslint-disable no-undef */
// import {
//   getExtend
// } from '@/utils/CesiumUtils.js'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    const layer = new Cesium.ImageryLayer(
      new Cesium.WebMapServiceImageryProvider({
        url: 'https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
        layers: 'Hydrography:bores',
        parameters: {
          transparent: true,
          format: 'image/png'
        }
      })
    )
    viewer.imageryLayers.add(layer)

    viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(114.591, -45.837, 148.97, -5.73)
    })
  },
  methods: {}
}
</script>

<style>
</style>
