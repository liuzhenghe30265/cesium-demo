<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;">
    <div
      class="btn_container">
      <button
        id="clear">清除primitive</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import CesiumUtils from '@/utils/CesiumUtils.js'
import * as turf from '@turf/turf'
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

    // 随机生成坐标
    const positions = turf.randomPoint(1000000, {
      bbox: [
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      ]
      // bbox: [
      //   114.72692258196378,
      //   38.1023045206586,
      //   119.02498669643339,
      //   40.94067311600792
      // ]
    }).features.map((_, index) => {
      return {
        longitude: _.geometry.coordinates[0],
        latitude: _.geometry.coordinates[1],
        altitude: 0,
        value: index
      }
    })
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      )
    })

    viewer.scene.renderError.addEventListener(function () {
      alert('内存超出100%')
    })

    // Entity 方式
    // const barEntity = new Cesium.Entity({
    //   id: 'bar',
    //   show: true
    // })
    // viewer.entities.add(barEntity)
    // positions.map((item, index) => {
    //   const color = Cesium.Color.fromHsl(0.1 - item.value * 0.1 / 100, 1.0, 1 - item.value / 100, 0.5)
    //   const entity = new Cesium.Entity({
    //     id: 'bar' + index,
    //     position: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude),
    //     show: true,
    //     cylinder: {
    //       topRadius: 100,
    //       bottomRadius: 100,
    //       heightReference: 0,
    //       length: item.value,
    //       material: new Cesium.ColorMaterialProperty(color),
    //       show: true
    //     },
    //     parent: barEntity
    //   })
    //   viewer.entities.add(entity)
    // })

    // Primitive 点
    // http://www.bigemap.com/Public/offline/gl/PointPrimitive.html
    const pointCollection = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection())
    positions.map((point, index) => {
      const color = Cesium.Color.fromHsl(0.1 - point.value * 0.1 / 100, 1.0, 1 - point.value / 100, 0.5)
      pointCollection.add({
        id: 'point' + index,
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        pixelSize: 10,
        color: color
      })
    })
    document.getElementById('clear').onclick = function () {
      // pointCollection.destroy()
      pointCollection.removeAll()
    }
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
.btn_container {
  position: absolute;
  z-index: 9;
  top: 50px;
  right: 50px;
  padding: 20px;
}
</style>
