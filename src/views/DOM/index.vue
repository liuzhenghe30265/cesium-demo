<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;" />
</template>

<script>
/* eslint-disable no-undef */
import * as turf from '@turf/turf'

// 方式一：
import TipUtil from './components/TipUtil'
function tipUtil ({
  ...rest
}) {
  return TipUtil({
    ...rest
  })
}
function MyTip (data) {
  return tipUtil(data)
}
window.$MyTip = MyTip

// 方式二：
import FloatingDom from '@/components/FloatingDom'
import TipDom from './components/TipDom.vue'
function MyTip2 (h, {
  component = null,
  componentName = '',
  messageData = {},
  confirmValidate = () => { },
  ...rest
}) {
  return FloatingDom({
    message: h(TipDom, {
      props: { messageData }
    }),
    duration: 0,
    ...rest
  })
}
window.$MyTip2 = MyTip2

export default {
  data () {
    return {
      tipObj: {}
    }
  },
  computed: {},
  watch: {},
  mounted () {
    window.$InitMap()
    const positions = turf
      .randomPoint(10, {
        bbox: [
          70.01180980018789, 20.12881664932077, 134.27620577723778,
          50.568644557429835
        ]
      })
      .features.map((_, index) => {
        return {
          longitude: parseFloat(_.geometry.coordinates[0]).toFixed(7),
          latitude: parseFloat(_.geometry.coordinates[1]).toFixed(7),
          altitude: index * 10
        }
      })
    for (let index = 0; index < positions.length; index++) {
      const element = positions[index]
      this.tipObj[index] = $MyTip({
        duration: 0,
        floatting: true,
        customClass: 'my_tip',
        messageData: element
      })
      // this.tipObj[index] = $MyTip2(this.$createElement, {
      //   duration: 0,
      //   floatting: true,
      //   customClass: 'my_tip',
      //   messageData: element
      // })
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.floating_dom {
  &.my_tip {
    width: max-content;
    min-width: auto;
    transition: none;
    background-color: rgba($color: #ffffff, $alpha: 0.8);
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
  }
}
</style>