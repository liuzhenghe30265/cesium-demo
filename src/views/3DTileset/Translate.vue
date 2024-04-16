<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    />
    <div style="position: absolute; bottom: 50px; right: 50px;z-index: 999;color: #fff;">
      modelMatrix: {{ currentModelMatrix }}
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils/common.js'
import { cutModelByPolygon } from '@/utils/ClippingPlane'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      currentModelMatrix: '',
      cut: false,
      tileset: null,
      oldModelMatrix: null,
      newPosition: {},
      oldPosition: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const flag = true
    window.$InitMap()

    const _this = this
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.

    // 添加 3DTileset
    this.tileset = new Cesium.Cesium3DTileset({
      url: 'https://image.giiiis.com/dayanta/tileset.json',
      debugShowMemoryUsage: false
    })

    viewer.scene.primitives.add(this.tileset)
    this.tileset.readyPromise
      .then(async tileset => {
        window.$tileset = tileset
        this.handleModelMatrix()
        this.oldModelMatrix = window.$tileset.modelMatrix

        // * 手动调整模型盖高度
        // const offsetHeight = 36.9
        // const cartographic = Cesium.Cartographic.fromCartesian(
        //   tileset.boundingSphere.center
        // )
        // console.log('................cartographic', cartographic)
        // const surface = Cesium.Cartesian3.fromRadians(
        //   cartographic.longitude,
        //   cartographic.latitude,
        //   cartographic.height
        // )
        // const offset = Cesium.Cartesian3.fromRadians(
        //   cartographic.longitude,
        //   cartographic.latitude,
        //   offsetHeight
        // )
        // const translation = Cesium.Cartesian3.subtract(
        //   offset,
        //   surface,
        //   new Cesium.Cartesian3()
        // )
        // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        // console.log(
        //   '...........tileset.modelMatrix',
        //   tileset.modelMatrix,
        //   Object.values(tileset.modelMatrix)
        // )

        this.oldPosition = cloneDeep(
          cartesianToLongAndLat(tileset.boundingSphere.center)
        )
        this.newPosition = cloneDeep(
          cartesianToLongAndLat(tileset.boundingSphere.center)
        )
      })
      .catch(error => {
        console.log(error)
      })
    viewer.zoomTo(this.tileset) // 视角切换到模型的位置

    document.addEventListener('keydown', event => {
      const e = event || window.event
      let modelMatrix = window.$tileset.modelMatrix

      // 定义移动速度
      const moveSpeed = 100.0
      switch (e.keyCode) {
        case 33:
          // up
          if (flag) {
            handleClick('Z', 'up')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(0, -1, 0),
              modelMatrix
            )
          }
          break
        case 34:
          // down
          if (flag) {
            handleClick('Z', 'down')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(0, 1, 0),
              modelMatrix
            )
          }
          break
        case 37:
          // 左
          if (flag) {
            handleClick('XY', 'left')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(-1, 0, 0),
              modelMatrix
            )
          }
          break
        case 38:
          // 上
          if (flag) {
            handleClick('XY', 'up')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(0, 0, -1),
              modelMatrix
            )
          }
          break
        case 39:
          // 右
          if (flag) {
            handleClick('XY', 'right')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(1, 0, 0),
              modelMatrix
            )
          }
          break
        case 40:
          // 下
          if (flag) {
            handleClick('XY', 'down')
          } else {
            modelMatrix = Cesium.Matrix4.multiplyByTranslation(
              modelMatrix,
              new Cesium.Cartesian3(0, 0, 1),
              modelMatrix
            )
          }
          break
        default:
          break
      }
      if (!flag) {
        window.$tileset.modelMatrix = modelMatrix
        _this.handleModelMatrix()
      }
    })
    document.addEventListener('keyup', event => {
      // const e = event || window.event
    })

    function handleClick(type, value) {
      const boundingSphere = window.$tileset.boundingSphere
      // * 中心点
      const center = boundingSphere.center

      let step = 0.001
      if (type === 'Z') {
        step = 0.1
        if (value === 'up') {
          _this.newPosition.altitude += step
        } else if (value === 'down') {
          _this.newPosition.altitude -= step
        }
      } else if (type === 'XY') {
        step = 0.0001
        if (value === 'left') {
          _this.newPosition.longitude -= step
        } else if (value === 'right') {
          _this.newPosition.longitude += step
        } else if (value === 'up') {
          _this.newPosition.latitude += step
        } else if (value === 'down') {
          _this.newPosition.latitude -= step
        }
      }
      window.$tileset.modelMatrix = _this.oldModelMatrix

      const offset = Cesium.Cartesian3.fromDegrees(
        _this.newPosition.longitude,
        _this.newPosition.latitude,
        _this.newPosition.altitude
      ) // 目的位置
      const translation = Cesium.Cartesian3.subtract(
        offset,
        center,
        new Cesium.Cartesian3()
      )
      window.$tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
      _this.handleModelMatrix()
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      // 平面坐标系转笛卡尔空间直角坐标系
      /**
            position: Cartesian2 {x: 683.0753784179688, y: 512.71826171875}
            转
            Cartesian3{x: -2174106.926252774, y: 4386734.375324652, z: 4074136.167795586}
           */
      console.log(
        '平面坐标系转笛卡尔空间直角坐标系',
        viewer.scene.pickPosition(event.position)
      )

      // 空间直角坐标系转经纬度
      const earthPosition = viewer.camera.pickEllipsoid(
        event.position,
        viewer.scene.globe.ellipsoid
      )
      const cartographic = Cesium.Cartographic.fromCartesian(
        earthPosition,
        viewer.scene.globe.ellipsoid,
        new Cesium.Cartographic()
      )
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      console.log(
        '空间直角坐标系转经纬度',
        longitude,
        latitude,
        cartographic.height
      )
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    handleModelMatrix() {
      this.currentModelMatrix = Object.values(window.$tileset.modelMatrix)
    }
  }
}
</script>
