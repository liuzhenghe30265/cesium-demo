<template>
  <div id="cesium-container" style="width: 100%; height: 100%;">
    <ul class="ul">
      <li v-for="(item, index) of deviceInfo" :key="index" class="li" :class="{ active: lock === item.id }"
        @click="handleClick(item)">
        {{ `飞机${item.id}` }}</li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
import DrawDeviceUtil from '@/utils/DrawDevice.js'
const mock = require('./mock.json')
const mock2 = require('./mock2.json')
const mock3 = require('./mock3.json')
const mock4 = require('./mock4.json')
const mock5 = require('./mock5.json')
export default {
  name: 'FlightAnimation',
  data () {
    return {
      lock: '',
      deviceInfo: [
        {
          id: 1,
          uri: 'model/Cesium_Air.glb',
          scale: 1,
          position: {
            longitude: mock[0].longitude,
            latitude: mock[0].latitude,
            altitude: mock[0].altitude
          }
        },
        {
          id: 2,
          uri: 'model/Cesium_Air.glb',
          scale: 0.9,
          position: {
            longitude: mock2[mock2.length - 1].longitude,
            latitude: mock2[mock2.length - 1].latitude,
            altitude: mock2[mock2.length - 1].altitude
          }
        },
        {
          id: 3,
          uri: 'model/Cesium_Air.glb',
          scale: 0.8,
          position: {
            longitude: mock3[mock3.length - 1].longitude,
            latitude: mock3[mock3.length - 1].latitude,
            altitude: mock3[mock3.length - 1].altitude
          }
        },
        {
          id: 4,
          uri: 'model/Cesium_Air.glb',
          scale: 1,
          position: {
            longitude: mock4[mock4.length - 1].longitude,
            latitude: mock4[mock4.length - 1].latitude,
            altitude: mock4[mock4.length - 1].altitude
          }
        },
        {
          id: 5,
          uri: 'model/Cesium_Air.glb',
          scale: 1,
          position: {
            longitude: mock5[mock5.length - 1].longitude,
            latitude: mock5[mock5.length - 1].latitude,
            altitude: mock5[mock5.length - 1].altitude
          }
        }
      ],
      $DrawDeviceUtil: null
    }
  },
  computed: {},
  watch: {},
  mounted () {
    // return
    window.$InitMap()
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    this.$DrawDeviceUtil = new DrawDeviceUtil()
    // * 添加设备
    this.$DrawDeviceUtil.AddDevices(this.deviceInfo)

    // * 模拟 ws 上报实时位置信息
    let count = 0
    setInterval(() => {
      count += 1
      const position = mock[count]
      const position2 = mock2[count]
      const position3 = mock3[count]
      const position4 = mock4[count]
      const position5 = mock5[count]
      // * 更新位置
      this.$DrawDeviceUtil.UpdatePosition(1, position)
      this.$DrawDeviceUtil.UpdatePosition(2, position2)
      this.$DrawDeviceUtil.UpdatePosition(3, position3)
      this.$DrawDeviceUtil.UpdatePosition(4, position4)
      this.$DrawDeviceUtil.UpdatePosition(5, position5)
    }, 300)

    // 鼠标事件
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) { },
      Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    handleLockEntity () {

    },
    handleUnlockEntity () {

    },
    handleClick (data) {
      this.lock = this.lock === data.id ? '' : data.id
      if (this.lock) {
        this.$DrawDeviceUtil.LockEntity(this.lock)
      } else {
        this.$DrawDeviceUtil.UnLockEntity()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ul {
  position: absolute;
  right: 50px;
  top: 50px;
  z-index: 999;
  color: #fff;

  .li {
    cursor: pointer;

    &.active {
      color: red;
    }
  }
}
</style>
