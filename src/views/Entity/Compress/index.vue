<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

  <script>
/* eslint-disable no-undef */
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
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    const mock = require('./data.json')
    console.log('.............mock', mock)
    for (let index = 0; index < mock.length; index++) {
      const element = mock[index]
      const vertices = element.objectInfo.activeShapePoints || []
      const _hierarchy = []
      const degreesArray = []
      //   element.objectInfo.centerPoint.longitude =
      //     element.objectInfo.centerPoint.longitude - 180
      //   element.objectInfo.centerPoint.latitude =
      //     element.objectInfo.centerPoint.latitude - 90
      if (vertices.length > 0) {
        vertices.map(point => {
          //   point.longitude = point.longitude - 180
          //   point.latitude = point.latitude - 90
          _hierarchy.push(
            Cesium.Cartesian3.fromDegrees(
              point.longitude,
              point.latitude,
              point.altitude
            )
          )
          degreesArray.push(point.longitude)
          degreesArray.push(point.latitude)
        })
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(_hierarchy)
        }, false) // 使贴地多边形在模型上有立体效果
        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            element.objectInfo.centerPoint.longitude,
            element.objectInfo.centerPoint.latitude,
            element.objectInfo.centerPoint.altitude
          ),
          label: {
            text: `${element.towerName}-顶点数${vertices.length}`,
            font: '30px sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#ff0'),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.fromCssColorString('#000'),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
          },
          polygon: {
            hierarchy: dynamicPositions,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.RED.withAlpha(0.6)
            )
          }
        })
        console.log('...............entity', entity)
      }

      // 压缩顶点
      var positions = Cesium.Cartesian3.fromDegreesArray(degreesArray)
      // 创建PolylineVolumeGeometry对象
      var geometry = new Cesium.PolylineVolumeGeometry({
        polylinePositions: positions,
        shapePositions: positions // 这里使用相同的顶点数组作为多边形的形状
      })
      console.log('.............geometry', geometry)
      // 使用Simplification算法简化多边形
      var simplifiedGeometry =
        Cesium.PolylineVolumeGeometry.createGeometry(geometry)
      console.log('..............simplifiedGeometry', simplifiedGeometry)

      var entityNew = new Cesium.Entity({
        geometry: simplifiedGeometry,
        appearance: new Cesium.MaterialAppearance({
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.GREEN
          })
        })
      })
      console.log('................entityNew', entityNew)
      // 将实体添加到场景中
      viewer.entities.add(entityNew)
    }

    // 鼠标事件
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
  methods: {}
}
</script>

<style></style>
