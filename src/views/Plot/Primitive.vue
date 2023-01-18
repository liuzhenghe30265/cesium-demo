
<template>
  <div id="cesium-container" style="width: 100%; height: 100%" />
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils.js'
import '@/utils/dynamicWallMaterialProperty'
// import { flattenDeep } from 'lodash'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
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
      scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
      // requestRenderMode: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
    })
    window.viewer = viewer

    const tileset = new Cesium.Cesium3DTileset({
      url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    const list = []
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const ray1 = viewer.camera.getPickRay(event.position)
      const cartesian = viewer.scene.globe.pick(ray1, viewer.scene)
      const pick = viewer.scene.pickPosition(event.position)
      const pickModel = viewer.scene.pick(event.position)
      let earthPosition = null
      console.log('...........pick', pick, pickModel)
      if (pick && pickModel && !pickModel.id) {
        earthPosition = pick
      } else {
        earthPosition = cartesian
      }
      if (!earthPosition) {
        return
      }
      list.push(cartesianToLongAndLat(earthPosition))
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    const PolylineCollection = new Cesium.PolylineCollection()
    viewer.scene.primitives.add(PolylineCollection)
    const PointPrimitiveCollection = new Cesium.PointPrimitiveCollection()
    viewer.scene.primitives.add(PointPrimitiveCollection)
    const LabelCollection = new Cesium.LabelCollection()
    viewer.scene.primitives.add(LabelCollection)
    let BasePrimitive = null
    BasePrimitive = new Cesium.GroundPrimitive({
      geometryInstances: [],
      appearance: new Cesium.PerInstanceColorAppearance({
        // faceForward: true
        // flat: false, // 当 true 时，片段着色中使用平面着色，这意味着不考虑照明。
        // translucent: false, // 当 true 时，几何体将显示为半透明
        // closed: true
      })
    })
    viewer.scene.primitives.add(BasePrimitive)

    const data = require('./mock.json')
    data.map(item => {
      if (item.objectInfo && item.objectInfo.drawingMode === 'polygon') {
        const _id = `${item.id}_plotPolygon`
        const _hierarchy = []
        item.objectInfo.activeShapePoints.map(point => {
          _hierarchy.push(point.longitude)
          _hierarchy.push(point.latitude)
          _hierarchy.push(point.altitude)
        })
        const color = item.objectInfo.colorValue
          ? new Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString(item.objectInfo.colorValue.hex8)
            )
          : new Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString('#0000ff').withAlpha(0.4)
            )
        const instance = new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArrayHeights(_hierarchy)
            ),
            perPositionHeight: true,
            closeTop: true,
            closeBottom: true,
            arcType: Cesium.ArcType.RHUMB,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
          }),
          id: _id,
          attributes: {
            color: color,
            show: new Cesium.ShowGeometryInstanceAttribute(true)
          }
        })
        // viewer.scene.primitives.add(
        //   new Cesium.GroundPrimitive({
        //     geometryInstances: [instance],
        //     appearance: new Cesium.PerInstanceColorAppearance({
        //       flat: true, // 当 true 时，片段着色中使用平面着色，这意味着不考虑照明。
        //       translucent: true // 当 true 时，几何体将显示为半透明
        //       // closed: true
        //     })
        //   })
        // )
        if (BasePrimitive && BasePrimitive.geometryInstances) {
          BasePrimitive.geometryInstances.push(
            new Cesium.GeometryInstance({
              geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                  Cesium.Cartesian3.fromDegreesArrayHeights(_hierarchy)
                ),
                perPositionHeight: true,
                closeTop: true,
                closeBottom: true,
                arcType: Cesium.ArcType.RHUMB,
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
              }),
              id: _id,
              attributes: {
                color: color,
                // color: new Cesium.ColorGeometryInstanceAttribute.fromColor(
                //   Cesium.Color.fromCssColorString(
                //     item.objectInfo.colorValue
                //       ? item.objectInfo.colorValue.hex8
                //       : Cesium.Color.RED.withAlpha(0.4)
                //   )
                // ),
                show: new Cesium.ShowGeometryInstanceAttribute(true)
              }
            })
          )
        }
      }
      if (item.objectInfo && item.objectInfo.drawingMode === 'polyline') {
        const _id = `${item.id}_plotPolyline`
        const positions = []
        item.objectInfo.activeShapePoints.map(point => {
          positions.push(point.longitude)
          positions.push(point.latitude)
          positions.push(point.altitude)
        })
        const color = item.objectInfo.colorValue
          ? new Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString(item.objectInfo.colorValue.hex8)
            )
          : new Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString('#0000ff').withAlpha(0.4)
            )

        // Entity
        // viewer.entities.add(
        //   new Cesium.Entity({
        //     id: _id,
        //     polyline: {
        //       positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        //       width: 10,
        //       material: new Cesium.PolylineArrowMaterialProperty(
        //         new Cesium.Color.fromCssColorString('#0000ff').withAlpha(1)
        //       )
        //     }
        //   })
        // )

        // PrimitiveCollection
        if (
          PolylineCollection &&
          PolylineCollection instanceof Cesium.PolylineCollection
        ) {
          PolylineCollection.add({
            id: _id,
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
            width: 2,
            material: Cesium.Material.fromType('Color', {
              color: Cesium.Color.fromCssColorString('#f60').withAlpha(1)
            })
          })
        }

        // Primitive
        const instance = new Cesium.GeometryInstance({
          geometry: new Cesium.SimplePolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
            colors: [],
            colorsPerVertex: true
          }),
          id: _id
          // attributes: {
          //   color: color,
          //   show: new Cesium.ShowGeometryInstanceAttribute(true)
          // }
        })
        viewer.scene.primitives.add(
          new Cesium.Primitive({
            geometryInstances: [instance],
            appearance: new Cesium.PerInstanceColorAppearance({
              material: Cesium.Color.RED.withAlpha(0.4),
              flat: true, // 当 true 时，片段着色中使用平面着色，这意味着不考虑照明。
              translucent: true // 当 true 时，几何体将显示为半透明
              // closed: true
            })
          })
        )
      }
      if (item.objectInfo && item.objectInfo.drawingMode === 'point') {
        if (
          PointPrimitiveCollection &&
          PointPrimitiveCollection instanceof Cesium.PointPrimitiveCollection
        ) {
          PointPrimitiveCollection.add({
            position: Cesium.Cartesian3.fromDegrees(
              item.objectInfo.centerPoint.longitude,
              item.objectInfo.centerPoint.latitude,
              item.objectInfo.centerPoint.altitude
            ),
            pixelSize: 10.0,
            outlineColor: Cesium.Color.TRANSPARENT,
            outlineWidth: 0.0,
            color: Cesium.Color.YELLOW
          })
        }
      }
      if (item.objectInfo && item.objectInfo.drawingMode === 'text') {
        if (
          LabelCollection &&
          LabelCollection instanceof Cesium.LabelCollection
        ) {
          LabelCollection.add({
            position: Cesium.Cartesian3.fromDegrees(
              item.objectInfo.centerPoint.longitude,
              item.objectInfo.centerPoint.latitude,
              item.objectInfo.centerPoint.altitude
            ),
            text: item.id + '',
            color: Cesium.Color.YELLOW
          })
        }
      }
    })
  },
  methods: {}
}
</script>

<style>
  * {
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
  }
</style>
