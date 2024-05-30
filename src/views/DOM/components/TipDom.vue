<template>
  <div
    class="tip_dom">
    <img
      class="icon"
      :src="require('@/assets/images/site.png')"
      alt=""
      style="width: 20px;height: 20px;">
    <div>
      <div>
        经度：{{ messageData.longitude }}
      </div>
      <div>
        纬度：{{ messageData.latitude }}
      </div>
      <div>
        海拔：{{ messageData.altitude }}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  name: 'TipDom',

  props: {
    messageData: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {}
  },

  mounted () {
    viewer.scene.preRender.addEventListener(this.eventListener)
  },

  beforeDestroy () {
    viewer.scene.preRender.removeEventListener(this.eventListener)
  },

  methods: {
    eventListener () {
      const position = Cesium.Cartesian3.fromDegrees(
        this.messageData.longitude,
        this.messageData.latitude,
        this.messageData.altitude
      )
      const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        position
      )
      // const cameraHeight = viewer.camera.positionCartographic.height
      // const value = 1 - cameraHeight / 5000
      // const scale = value < 0.2 ? 0.2 : value > 1 ? 1 : value
      // if (scale === 0.2) {
      //   this.$parent.$el.style.display = 'none'
      //   return
      // }
      if (position) {
        this.$parent.$el.style.transform = `translateX(-50%) translateY(-50%)`
        this.$parent.$el.style.left = `${result.x}px`
        this.$parent.$el.style.top = `${result.y}px`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tip_dom {
  display: flex;
  align-items: center;
  .icon {
    animation: scale 2s linear infinite;
  }
}

@keyframes scale {
  0% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>