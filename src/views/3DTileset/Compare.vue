<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    >
      <div id="slider" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  async mounted() {
    window.$InitMap()
    // const _this = this
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.

    try {
      const left = await new Cesium.Cesium3DTileset({
        url: '/model/truck/good/terra_b3dms/tileset.json',
        // url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json',
        debugShowMemoryUsage: false
      })
      viewer.scene.primitives.add(left)
      left.splitDirection = Cesium.SplitDirection.LEFT

      viewer.zoomTo(left)

      const right = await new Cesium.Cesium3DTileset({
        url: '/model/truck/bad/terra_b3dms/tileset.json',
        // url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json',
        debugShowMemoryUsage: false
      })
      viewer.scene.primitives.add(right)
      right.splitDirection = Cesium.SplitDirection.RIGHT
    } catch (error) {
      console.log(`Error loading tileset: ${error}`)
    }

    const slider = document.getElementById('slider')
    viewer.scene.splitPosition =
      slider.offsetLeft / slider.parentElement.offsetWidth

    const handler = new Cesium.ScreenSpaceEventHandler(slider)

    let moveActive = false

    function move(movement) {
      if (!moveActive) {
        return
      }

      const relativeOffset = movement.endPosition.x
      const splitPosition =
        (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth
      slider.style.left = `${100.0 * splitPosition}%`
      viewer.scene.splitPosition = splitPosition
    }

    handler.setInputAction(function () {
      moveActive = true
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(function () {
      moveActive = true
    }, Cesium.ScreenSpaceEventType.PINCH_START)

    handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE)

    handler.setInputAction(function () {
      moveActive = false
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction(function () {
      moveActive = false
    }, Cesium.ScreenSpaceEventType.PINCH_END)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#slider {
  position: absolute;
  left: 50%;
  top: 0px;
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 9999;
  cursor: ew-resize;
}
</style>
