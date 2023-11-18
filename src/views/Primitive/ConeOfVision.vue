<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  >
    <div
      class="control"
      style="position: absolute;right: 50px;top: 50px;z-index: 999;width: 400px;color: #fff;"
    >
      <div>
        <span>heading</span>
        <el-slider
          v-model="heading"
          :min="0"
          :max="360"
          show-input
          @input="handleChange"
        />
      </div>
      <div>
        <span>pitch</span>
        <el-slider
          v-model="pitch"
          :min="0"
          :max="360"
          show-input
          @input="handleChange"
        />
      </div>
      <div>
        <span>roll</span>
        <el-slider
          v-model="roll"
          :min="0"
          :max="360"
          show-input
          @input="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
import CreateFrustum from './CreateFrustum'
export default {
  name: 'ConeOfVision',
  data() {
    return {
      longitude: 117,
      latitude: 39,
      altitude: 100,
      roll: 0,
      pitch: 0,
      heading: 0,
      frustum: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117, 38.992, 1000.0),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-45.0),
        roll: 0.0
      }
    })

    // * 创建视锥体（primitive，根据坐标和 heading，pitch，roll 实时更新椎体姿态）
    this.frustum = new CreateFrustum({
      position: {
        longitude: this.longitude,
        latitude: this.latitude,
        altitude: this.altitude
      },
      headingPitchRoll: {
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      },
      fov: 90, // 视场的角度（FOV），以弧度表示
      near: 200.0, // 近平面的距离
      far: 10.0, // 远平面的距离
      aspectRatio: 150 / 100 // 截锥的宽度和高度的纵横比
    })

    // * 视锥（primitive，根据两个坐标绘制）
    // const startPosition = Cesium.Cartesian3.fromDegrees(117.0, 39.0, 0)
    // const endPosition = Cesium.Cartesian3.fromDegrees(115.0, 37.0, 0)
    // // 视锥
    // const spotLightCamera = new Cesium.Camera(viewer.scene)
    // const direction = Cesium.Cartesian3.normalize(
    //   Cesium.Cartesian3.subtract(
    //     endPosition,
    //     startPosition,
    //     new Cesium.Cartesian3()
    //   ),
    //   new Cesium.Cartesian3()
    // )
    // spotLightCamera.position = startPosition // 相机起点
    // spotLightCamera.direction = direction // 相机面向的方向
    // spotLightCamera.up = Cesium.Cartesian3.clone(viewer.camera.up)
    // spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE
    // spotLightCamera.frustum.near = 0.1
    // spotLightCamera.frustum.far = Cesium.Cartesian3.distance(
    //   startPosition,
    //   endPosition
    // )
    // const scratchRight = new Cesium.Cartesian3()
    // const scratchRotation = new Cesium.Matrix3()
    // const scratchOrientation = new Cesium.Quaternion()
    // const directionWC = spotLightCamera.directionWC
    // const up = spotLightCamera.upWC
    // let right = spotLightCamera.rightWC
    // right = Cesium.Cartesian3.negate(right, scratchRight)

    // const rotation = scratchRotation
    // Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
    // Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
    // Cesium.Matrix3.setColumn(rotation, 2, directionWC, rotation)
    // // 计算视锥姿态
    // const orientation = Cesium.Quaternion.fromRotationMatrix(
    //   rotation,
    //   scratchOrientation
    // )
    // // 视锥轮廓线图形
    // const instanceOutline = new Cesium.GeometryInstance({
    //   geometry: new Cesium.FrustumOutlineGeometry({
    //     frustum: spotLightCamera.frustum,
    //     origin: startPosition,
    //     orientation: orientation
    //   }),
    //   attributes: {
    //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(
    //       Cesium.Color.YELLOW
    //     ),
    //     show: new Cesium.ShowGeometryInstanceAttribute(true)
    //   }
    // })
    // // 添加图元
    // viewer.scene.primitives.add(
    //   new Cesium.Primitive({
    //     geometryInstances: instanceOutline,
    //     eleaseGeometryInstances: false,
    //     appearance: new Cesium.PerInstanceColorAppearance({
    //       flat: true
    //     })
    //   })
    // )
  },
  methods: {
    handleChange() {
      this.frustum.update(
        {
          longitude: this.longitude,
          latitude: this.latitude,
          altitude: this.altitude
        },
        {
          heading: this.heading,
          pitch: this.pitch,
          roll: this.roll
        }
      )
    }
  }
}
</script>

<style></style>
