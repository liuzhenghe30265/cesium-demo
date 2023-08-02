<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%"
  >
    <div class="btn_container">
      <button id="clear">清除</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-reserved-keys */
import * as turf from '@turf/turf'
export default {
  data() {
    return {
      _primitive: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const _this = this

    window.$InitMap()

    // 随机生成坐标
    // const positions = turf
    //   .randomPoint(1000, {
    //     bbox: [
    //       70.01180980018789, 20.12881664932077, 134.27620577723778,
    //       50.568644557429835
    //     ]
    //     // bbox: [
    //     // 114.72692258196378, 38.1023045206586, 119.02498669643339,
    //     // 40.94067311600792
    //     // ]
    //   })
    //   .features.map((_, index) => {
    //     return {
    //       longitude: _.geometry.coordinates[0],
    //       latitude: _.geometry.coordinates[1],
    //       altitude: index,
    //       value: index
    //     }
    //   })
    // viewer.camera.flyTo({
    //   destination: Cesium.Rectangle.fromDegrees(
    //     70.01180980018789,
    //     20.12881664932077,
    //     134.27620577723778,
    //     50.568644557429835
    //   )
    // })

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117.7138219, 39.0774414, 1000)
    })

    viewer.scene.renderError.addEventListener(function () {
      alert('内存超出100%')
    })

    document.getElementById('clear').onclick = function () {}

    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(117.7138219, 39.0774414, 100)
    )
    const model = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: 'model/Cesium_Air.glb',
        // scale: 1000,
        // id: 'Model',
        allowPicking: true,
        show: true,
        // color: new Cesium.Color(0, 1, 1, 0.3),
        // colorBlendMode: Cesium.ColorBlendMode.MIX,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   0.0,
        //   500000.0
        // ),
        modelMatrix: modelMatrix
      })
    )
    console.log('............model', model)
    // 旋转角度
    const headingPitchRoll = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0)
    // 旋转矩阵
    const rotationMatrix = Cesium.Matrix3.fromHeadingPitchRoll(headingPitchRoll)
    const m = model.modelMatrix
    // 矩阵计算
    Cesium.Matrix4.multiplyByMatrix3(m, rotationMatrix, m)
    // 将计算结果再赋值给 modelMatrix
    model.modelMatrix = m

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {},
    Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {}
}
</script>

<style>
.btn_container {
  position: absolute;
  z-index: 9;
  top: 50px;
  right: 50px;
  padding: 20px;
}
</style>
