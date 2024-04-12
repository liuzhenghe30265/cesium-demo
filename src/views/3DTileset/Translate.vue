<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    />
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
      cut: false,
      tileset: null,
      newPosition: {},
      oldPosition: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
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
      switch (e.keyCode) {
        case 33:
          // up
          handleClick('Z', 'up')
          break
        case 34:
          // down
          handleClick('Z', 'down')
          break
        case 37:
          // 左
          handleClick('XY', 'left')
          break
        case 38:
          // 上
          handleClick('XY', 'up')
          break
        case 39:
          // 右
          handleClick('XY', 'right')
          break
        case 40:
          // 下
          handleClick('XY', 'down')
          break
        default:
          break
      }
    })

    function handleClick(type, value) {
      const boundingSphere = window.$tileset.boundingSphere
      // * 中心点
      const center = boundingSphere.center

      const step = 0.00001
      if (type === 'Z') {
        if (value === 'up') {
          _this.newPosition.altitude += step
        } else if (value === 'down') {
          _this.newPosition.altitude -= step
        }
      } else if (type === 'XY') {
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
      console.log(
        '............tileset.modelMatrix',
        window.$tileset.modelMatrix
      )
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
  methods: {}
}
</script>
