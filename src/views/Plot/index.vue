
<template>
  <div id="cesium-container" style="width: 100%; height: 100%" />
</template>

<script>
/* eslint-disable no-undef */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils.js'
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

    const data = require('./mock.json')
    data.map(item => {
      if (item.objectInfo && item.objectInfo.drawingMode === 'polygon') {
        const hierarchy = []
        item.objectInfo.activeShapePoints.map(point => {
          const Cartesian3 = Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          )
          hierarchy.push(Cartesian3)
          viewer.entities.add({
            name: 'plotGraphic',
            position: Cartesian3,
            point: {
              color: Cesium.Color.YELLOW,
              pixelSize: 20
            }
          })
        })
        viewer.entities.add({
          name: 'plotGraphic',
          polygon: {
            hierarchy: hierarchy,
            // extrudedHeight: 200,
            // perPositionHeight: true,
            // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            material: Cesium.Color.RED.withAlpha(0.6)
          }
        })
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
