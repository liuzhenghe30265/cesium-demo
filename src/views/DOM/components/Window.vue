<template>
  <div style="display: flex; align-items: center;">
    <img
      :src="require('@/assets/images/site.png')"
      alt=""
      style="width: 20px;height: 20px;"
    >
    <div>
      <div>经度：{{ messageData.longitude }}</div>
      <div>纬度：{{ messageData.latitude }}</div>
      <div>海拔：{{ messageData.altitude }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Window',

  props: {
    messageData: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {}
  },

  mounted() {
    viewer.scene.preRender.addEventListener(this.eventListener)
  },

  beforeDestroy() {
    viewer.scene.preRender.removeEventListener(this.eventListener)
  },

  methods: {
    eventListener() {
      // const value = 1 - viewer.camera.positionCartographic.height / 10000
      // const scale = value < 0.2 ? 0.2 : value > 1 ? 1 : value
      // this.$parent.$el.style.transform = `scale(${scale})`

      const position = Cesium.Cartesian3.fromDegrees(
        this.messageData.longitude,
        this.messageData.latitude,
        this.messageData.altitude
      )
      const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        position
      )
      if (position) {
        this.$parent.$el.style.left = `${result.x}px`
        this.$parent.$el.style.top = `${result.y}px`
      }
    }
  }
}
</script>
