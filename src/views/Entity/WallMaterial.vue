<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
import '@/utils/dynamicWallMaterialProperty.js'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    // viewer.camera.flyTo({
    //   destination: Cesium.Rectangle.fromDegrees(
    //     108.93447869899144,
    //     34.21942105070211,
    //     108.98528666210252,
    //     34.24828003352733
    //   )
    // })

    const tileset = new Cesium.Cesium3DTileset({
      url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    addWall(
      [
        108.95816733886228, 34.22253637959828, 108.95820680817125,
        34.21706473291823, 108.96123913566905, 34.21706546799099,
        108.96179243633605, 34.21702583001026
      ],
      [470, 470, 470, 470],
      [420, 420, 420, 420],
      '#ffff00',
      require('@/assets/images/gradation.png'),
      1000
    )
    addWall(
      [
        108.9590995, 34.2201324, 108.9598067, 34.2201193, 108.9598333,
        34.2195012, 108.9590877, 34.2195194, 108.9590995, 34.2201324
      ],
      [470, 470, 470, 470, 470],
      [420, 420, 420, 420, 420],
      '#20E8E980',
      require('@/assets/images/gradation.png'),
      1000
    )

    function addWall(
      positions,
      maximumHeights,
      minimumHeights,
      color,
      image,
      duration
    ) {
      const entity = viewer.entities.add({
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          maximumHeights: maximumHeights,
          minimumHeights: minimumHeights,
          // disableDepthTestDistance: Number.POSITIVE_INFINITY,
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: new Cesium.DynamicWallMaterialProperty({
            color: Cesium.Color.fromCssColorString(color),
            trailImage: image,
            duration: duration
          })
        }
      })
      return entity
    }
  },
  methods: {}
}
</script>

  <style></style>
