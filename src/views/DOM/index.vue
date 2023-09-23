<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
import { Message } from 'element-ui'
import Window from './components/Window.vue'
import * as turf from '@turf/turf'
import Vue from 'vue'

function MonomerMessage(
  h,
  {
    component = null,
    componentName = '',
    messageData = {},
    confirmValidate = () => {},
    ...rest
  }
) {
  return Message({
    message: h(Window, {
      props: { messageData }
    }),
    duration: 0,
    ...rest
  })
}
window.$MyMessage = MonomerMessage

export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      )
    })

    const positions = turf
      .randomPoint(1, {
        bbox: [
          70.01180980018789, 20.12881664932077, 134.27620577723778,
          50.568644557429835
        ]
      })
      .features.map((_, index) => {
        return {
          longitude: parseFloat(_.geometry.coordinates[0]).toFixed(7),
          latitude: parseFloat(_.geometry.coordinates[1]).toFixed(7),
          altitude: index
        }
      })

    // console.log('............positions', positions)

    console.log('.............this.$createElement', this.$createElement)
    console.log('.........vue', Vue, this)
    window.Vue = Vue

    for (let index = 0; index < positions.length; index++) {
      const element = positions[index]
      $MyMessage(this.$createElement, {
        customClass: 'my_message',
        messageData: element
      })
    }
    // console.log('...........666', $MyMessage)
  },
  methods: {}
}
</script>

<style lang="scss">
.el-message {
  &.my_message {
    background-color: rgba($color: #fff, $alpha: 0.6);
    min-width: auto;
    // color: #fff;
    .el-icon-info {
      display: none;
    }
  }
}
</style>