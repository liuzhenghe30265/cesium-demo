<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
export default {
  name: 'ConeOfVision',
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    const startPosition = Cesium.Cartesian3.fromDegrees(117.0, 39.0, 0)
    const endPosition = Cesium.Cartesian3.fromDegrees(115.0, 37.0, 0)
    // 视锥
    const spotLightCamera = new Cesium.Camera(viewer.scene)
    const direction = Cesium.Cartesian3.normalize(
      Cesium.Cartesian3.subtract(
        endPosition,
        startPosition,
        new Cesium.Cartesian3()
      ),
      new Cesium.Cartesian3()
    )
    spotLightCamera.position = startPosition // 相机起点
    spotLightCamera.direction = direction // 相机面向的方向
    spotLightCamera.up = Cesium.Cartesian3.clone(viewer.camera.up)
    spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE
    spotLightCamera.frustum.near = 0.1
    spotLightCamera.frustum.far = Cesium.Cartesian3.distance(
      startPosition,
      endPosition
    )
    const scratchRight = new Cesium.Cartesian3()
    const scratchRotation = new Cesium.Matrix3()
    const scratchOrientation = new Cesium.Quaternion()
    const directionWC = spotLightCamera.directionWC
    const up = spotLightCamera.upWC
    let right = spotLightCamera.rightWC
    right = Cesium.Cartesian3.negate(right, scratchRight)

    const rotation = scratchRotation
    Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
    Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
    Cesium.Matrix3.setColumn(rotation, 2, directionWC, rotation)
    // 计算视锥姿态
    const orientation = Cesium.Quaternion.fromRotationMatrix(
      rotation,
      scratchOrientation
    )
    // 视锥轮廓线图形
    const instanceOutline = new Cesium.GeometryInstance({
      geometry: new Cesium.FrustumOutlineGeometry({
        frustum: spotLightCamera.frustum,
        origin: startPosition,
        orientation: orientation
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.YELLOW
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true)
      }
    })
    // 添加图元
    viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instanceOutline,
        eleaseGeometryInstances: false,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true
        })
      })
    )
  },
  methods: {}
}
</script>

<style></style>
