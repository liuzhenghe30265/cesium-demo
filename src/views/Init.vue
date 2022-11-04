
<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;" />
</template>

<script>
/* eslint-disable no-undef */
// import {
//   getExtend
// } from '@/utils/CesiumUtils.js'
export default {
  data () {
    return {}
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
    const viewer = new Cesium.Viewer('cesium-container', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false, // 是否显示左下角的仪表盘
      baseLayerPicker: false, // 是否显示图层选择器按钮，右上角那个地图图标
      fullscreenButton: false, // 是否显示全屏按钮
      vrButton: false, // 是否显示VR按钮
      geocoder: false, // 是否显示搜索按钮
      homeButton: false, // 是否显示主页按钮
      infoBox: false, // 是否显示提示信息
      sceneModePicker: false, // 是否显示右上角的模式切换按钮
      selectionIndicator: false, // 是否显示选取指示器组件
      timeline: false, // 是否显示下边的时间轴
      navigationHelpButton: false, // 是否显示右上角的帮助按钮
      navigationInstructionsInitiallyVisible: true, // 是否显示导航
      // scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
      // requestRenderMode: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
    })

    // 1. Fly to a position with a top-down view
    // viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 15000.0)
    // })

    // 2. Fly to a Rectangle with a top-down view
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

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
      // console.log(getExtend(viewer))
      // console.log(viewer.camera.computeViewRectangle())

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
      // 平面坐标系转笛卡尔空间直角坐标系
      /**
        position: Cartesian2 {x: 683.0753784179688, y: 512.71826171875}
        转
        Cartesian3{x: -2174106.926252774, y: 4386734.375324652, z: 4074136.167795586}
       */
      console.log('平面坐标系转笛卡尔空间直角坐标系', viewer.scene.pickPosition(event.position))

      // 空间直角坐标系转经纬度
      const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
      const cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      console.log('空间直角坐标系转经纬度', longitude, latitude, cartographic.height)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.LEFT_UP)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.MIDDLE_UP)

    handler.setInputAction(function (movement) {
      // 鼠标移动到实体上，鼠标样式改为 pointer
      // let isEntity = false
      // const pick = viewer.scene.pick(movement.endPosition)
      // if (viewer.scene.pickPositionSupported && Cesium.defined(pick) && pick.id) {
      //   // 实体对应的 name
      //   if (pick.id.name) {
      //     isEntity = ['point'].indexOf(pick.id.name) > -1
      //   }
      // } else {
      //   isEntity = false
      // }
      // viewer._container.style.cursor = isEntity ? 'pointer' : 'default'
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)

    // handler.setInputAction(function (event) {
    // }, Cesium.ScreenSpaceEventType.RIGHT_UP)

    // handler.setInputAction(function (wheelment) {
    // }, Cesium.ScreenSpaceEventType.WHEEL)

    // 删除事件
    // handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)
  },
  methods: {

  }
}
</script>

<style>
* {
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
</style>
