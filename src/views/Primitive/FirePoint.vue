<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

  <script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()
    // 1. Fly to a position with a top-down view
    // viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 15000.0)
    // })

    // 2. Fly to a Rectangle with a top-down view
    // viewer.camera.flyTo({
    //   destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // })

    // 3. Fly to a position with an orientation using unit vectors.
    // viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 5000.0),
    //   orientation: {
    //     direction: new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
    //     up: new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    //   }
    // })

    // 4. Fly to a position with an orientation using heading, pitch and roll.
    // viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 5000.0),
    //   orientation: {
    //     heading: Cesium.Math.toRadians(175.0),
    //     pitch: Cesium.Math.toRadians(-35.0),
    //     roll: 0.0
    //   }
    // })

    // 5. 监听地图变化，获取 position，heading，pitch，roll
    // const position = viewer.camera.position
    // const heading = viewer.camera.heading
    // const pitch = viewer.camera.pitch
    // const roll = viewer.camera.roll
    // const initialPosition = new Cesium.Cartesian3(position.x, position.y, position.z) // 相机的位置
    // const orientation = {
    //   heading: heading,
    //   pitch: pitch,
    //   roll: roll
    // }
    // const homeCameraView = {
    //   destination: initialPosition,
    //   orientation: orientation
    // }
    // viewer.scene.camera.setView(homeCameraView)

    // 监听地图缩放等级
    viewer.scene.camera.moveEnd.addEventListener(() => {
      // const currentMagnitude = viewer.camera.getMagnitude()
      // console.log('currentMagnitude - ' + currentMagnitude)
    })

    // 监听视角变化
    viewer.camera.percentageChanged = 0.00001
    viewer.camera.changed.addEventListener(function (event) {
      // 计算当前视角地图范围
      //   const Rectangle = viewer.camera.computeViewRectangle()
      //   console.log('Rectangle', viewer.camera.computeViewRectangle())
      //   const extent = [Rectangle.west / Math.PI * 180, Rectangle.south / Math.PI * 180, Rectangle.east / Math.PI * 180, Rectangle.north / Math.PI * 180]
      //   console.log('extent', extent)
      // 中心点
      // const result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2))
      // let longitude = null
      // let latitude = null
      // if (result) {
      //   const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
      //   longitude = curPosition.longitude * 180 / Math.PI
      //   latitude = curPosition.latitude * 180 / Math.PI
      // } else {
      //   longitude = Cesium.Math.toDegrees(
      //     viewer.scene.globe.ellipsoid.cartesianToCartographic(
      //       viewer.camera.position
      //     ).longitude
      //   )
      //   latitude = Cesium.Math.toDegrees(
      //     viewer.scene.globe.ellipsoid.cartesianToCartographic(
      //       viewer.camera.position
      //     ).latitude
      //   )
      // }
      // console.log('中心点', longitude, latitude)
      // console.log('position', viewer.camera.position)
      // console.log('heading', viewer.camera.heading)
      // console.log('pitch', viewer.camera.pitch)
      // console.log('roll', viewer.camera.roll)
      // const cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position).height
      // console.log('cameraHeight', cameraHeight)
    })

    // 鼠标事件
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
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

      const entity = viewer.entities.add(
        new Cesium.Entity({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 100),
          point: new Cesium.PointGraphics({
            pixelSize: 10,
            show: true
          })
        })
      )

      const ParticleSystem = new Cesium.ParticleSystem({
        image: require('@/assets/images/smoke.png'),
        imageSize: new Cesium.Cartesian2(20, 20),
        startColor: new Cesium.Color(
          1,
          0.6588235294117647,
          0.07450980392156863,
          1
        ),
        endColor: new Cesium.Color(0, 0, 0, 0.1),
        startScale: 2.0,
        endScale: 5.0,
        particleLife: 1.0,
        speed: 5.0,
        emitter: new Cesium.CircleEmitter(0.8),
        modelMatrix: entity.computeModelMatrix(
          viewer.clock.startTime,
          new Cesium.Matrix4()
        ),
        lifetime: 16.0,
        particleSize: 57,
        emissionRate: 21,
        emitterRadius: 4
      })
      console.log('..............ParticleSystem', ParticleSystem)
      viewer.scene.primitives.add(ParticleSystem)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {}
}
</script>

  <style></style>
