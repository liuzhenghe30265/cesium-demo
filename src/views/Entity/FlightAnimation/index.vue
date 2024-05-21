<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
// import { GetCesiumVersion, screenTo3D } from 'lk-cesium-utils'
import { cartesianToLongAndLat } from '@/utils/CesiumUtils/common.js'
import DrawDeviceUtil from '@/utils/DrawDevice.js'
export default {
  data() {
    return {
      $DrawDeviceUtil: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const mock = require('./mock.json')
    const mock2 = require('./mock2.json')
    window.$InitMap()
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    this.$DrawDeviceUtil = new DrawDeviceUtil()
    const deviceInfo = [
      {
        id: 1,
        uri: 'model/Cesium_Air.glb',
        scale: 0.2,
        position: {
          longitude: mock[0].longitude,
          latitude: mock[0].latitude,
          altitude: mock[0].altitude
        }
      },
      {
        id: 2,
        uri: 'model/Cesium_Air.glb',
        scale: 0.2,
        position: {
          longitude: mock2[mock2.length - 1].longitude,
          latitude: mock2[mock2.length - 1].latitude,
          altitude: mock2[mock2.length - 1].altitude
        }
      }
    ]
    // * 添加设备
    this.$DrawDeviceUtil.AddDevices(deviceInfo)

    // * 模拟 ws 上报实时位置信息
    let count = 0
    setInterval(() => {
      count += 1
      const position = mock[count]
      const position2 = mock2[count]
      // * 更新位置
      this.$DrawDeviceUtil.UpdatePosition(1, position)
      this.$DrawDeviceUtil.UpdatePosition(2, position2)
    }, 300)

    // * 锁定
    const entity = this.$DrawDeviceUtil.devices[2]

    const matrix3Scratch = new Cesium.Matrix3()
    const orientationScratch = new Cesium.Quaternion()
    function getModelMatrix(entity, time, result) {
      const entityposition = Cesium.Property.getValueOrUndefined(
        entity.position,
        time,
        new Cesium.Cartesian3()
      )
      if (!entityposition) return null
      let position = cartesianToLongAndLat(entityposition)
      if (!position) return null
      position = Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.altitude
      )
      if (!Cesium.defined(position)) {
        return undefined
      }
      const orientation = Cesium.Property.getValueOrUndefined(
        entity.orientation,
        time,
        orientationScratch
      )
      if (Cesium.defined(orientation)) {
        result = Cesium.Matrix4.fromRotationTranslation(
          Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
          position,
          result
        )
      } else {
        result = Cesium.Transforms.eastNorthUpToFixedFrame(
          position,
          undefined,
          result
        )
      }
      return result
    }
    let lock = false
    let lockFirst = false // 第一人称锁定
    var scratch = new Cesium.Matrix4()
    var camera = viewer.scene.camera
    viewer.scene.preRender.addEventListener(function () {
      if (lock) {
        if (getModelMatrix(entity, viewer.clock.currentTime, scratch)) {
          camera.lookAtTransform(scratch, new Cesium.Cartesian3(-20, 0, 10))
        } else {
          camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        }
      } else {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      }
    })

    // 第一人称
    function listenDeviceCamera() {
      const time = viewer.clock.currentTime
      const entityposition = Cesium.Property.getValueOrUndefined(
        entity.position,
        time,
        new Cesium.Cartesian3()
      )
      // 源
      // const podOrientation = Cesium.Quaternion.fromHeadingPitchRoll(
      //   new Cesium.HeadingPitchRoll(
      //     Cesium.Math.toRadians(podRang.yaw),
      //     Cesium.Math.toRadians(podRang.pitch),
      //     Cesium.Math.toRadians(podRang.roll)
      //   )
      // )
      const podOrientation = Cesium.Property.getValueOrUndefined(
        entity.orientation,
        time,
        new Cesium.Quaternion()
      )
      viewer.scene.camera.setView({
        destination: entityposition,
        orientation: new Cesium.HeadingPitchRoll.fromQuaternion(podOrientation)
      })
    }

    const DOM = document.createElement('div')
    DOM.setAttribute('id', 'debugBtn')
    DOM.innerHTML = '锁定'
    DOM.style.position = 'absolute'
    DOM.style.top = '50px'
    DOM.style.right = '50px'
    DOM.style.zIndex = 999
    document.body.appendChild(DOM)
    document.getElementById('debugBtn').onclick = function () {
      // lock = !lock
      lockFirst = !lockFirst
      if (lockFirst) {
        // 第一人称锁定
        viewer.scene.preRender.addEventListener(listenDeviceCamera)
      } else {
        viewer.scene.preRender.removeEventListener(listenDeviceCamera)
      }
    }

    // 鼠标事件
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {},
    Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    handleTest() {
      const mock = require('./mock.json')
      const animate = {
        pointWidth: 20,
        alp: 0.8,
        r: 0,
        g: 1,
        b: 0
      }
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        Cesium.Cartesian3.fromDegrees(
          mock[0].longitude,
          mock[0].latitude,
          mock[0].altitude
        ),
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(0)
        )
      )
      const options = {
        position: new Cesium.SampledPositionProperty(),
        // position: new Cesium.Cartesian3.fromDegrees(
        //   mock[0].longitude,
        //   mock[0].latitude,
        //   mock[0].altitude
        // ),
        orientation: orientation,
        model: {
          runAnimations: false,
          uri: window.SITE_CONFIG['modelsUrl'] + 'gltf/sheng/feiji.glb',
          scale: 0.1
        },
        point: {
          pixelSize: new Cesium.CallbackProperty(function () {
            animate.pointWidth += 0.2
            if (animate.pointWidth >= 35) {
              animate.pointWidth = 25
            }
            return animate.pointWidth
          }, false),
          color: new Cesium.CallbackProperty(function () {
            animate.alp -= 0.01
            if (animate.alp <= 0.3) {
              animate.alp = 0.8
            }
            return new Cesium.Color(
              animate.r,
              animate.g,
              animate.b,
              animate.alp
            )
          }, false),
          outlineWidth: 0,
          scaleByDistance: new Cesium.NearFarScalar(110, 1, 400000, 0.6),
          show: true
        },
        path: {
          show: true,
          leadTime: 0,
          trailTime: 3600,
          width: 2,
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            taperPower: 1,
            color: Cesium.Color.PALEGOLDENROD
          })
        }
      }
      const entity = viewer.entities.add(options)
      let count = 0
      setInterval(() => {
        count += 1
        const point = mock[count]
        const p2 = new Cesium.Cartesian3.fromDegrees(
          point.longitude,
          point.latitude,
          point.altitude
        )
        const start = viewer.clock.currentTime
        const time = 0.7
        const stop = Cesium.JulianDate.addSeconds(
          start,
          time,
          new Cesium.JulianDate()
        )
        entity.position.addSample(stop, p2)
      }, 300)

      const matrix3Scratch = new Cesium.Matrix3()
      const orientationScratch = new Cesium.Quaternion()
      function getModelMatrix(entity, time, result) {
        const entityposition = Cesium.Property.getValueOrUndefined(
          entity.position,
          time,
          new Cesium.Cartesian3()
        )
        if (!entityposition) return null
        let position = cartesianToLongAndLat(entityposition)
        if (!position) return null
        position = Cesium.Cartesian3.fromDegrees(
          position.longitude,
          position.latitude,
          position.altitude
        )
        if (!Cesium.defined(position)) {
          return undefined
        }
        const orientation = Cesium.Property.getValueOrUndefined(
          entity.orientation,
          time,
          orientationScratch
        )
        if (Cesium.defined(orientation)) {
          result = Cesium.Matrix4.fromRotationTranslation(
            Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
            position,
            result
          )
        } else {
          result = Cesium.Transforms.eastNorthUpToFixedFrame(
            position,
            undefined,
            result
          )
        }
        return result
      }
      let lock = false
      var scratch = new Cesium.Matrix4()
      var camera = viewer.scene.camera
      viewer.scene.preRender.addEventListener(function () {
        if (lock) {
          if (getModelMatrix(entity, viewer.clock.currentTime, scratch)) {
            camera.lookAtTransform(scratch, new Cesium.Cartesian3(-20, 0, 10))
          } else {
            camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
          }
        } else {
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        }
      })

      const DOM = document.createElement('div')
      DOM.setAttribute('id', 'debugBtn')
      DOM.innerHTML = 'test'
      DOM.style.position = 'absolute'
      DOM.style.top = '50px'
      DOM.style.right = '50px'
      DOM.style.zIndex = 999
      document.body.appendChild(DOM)
      document.getElementById('debugBtn').onclick = function () {
        lock = !lock
      }
    }
  }
}
</script>

<style></style>
