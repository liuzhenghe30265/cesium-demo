<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;">
    <div
      class="btn_container">
      <button
        @click="handlePlay">{{ play ? '暂停' : '播放' }}</button>
      <button
        @click="handleRestart">重新开始</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-reserved-keys */
/* eslint-disable new-cap */
import points from './points.json'
import CesiumUtils from '@/utils/CesiumUtils.js'
// import * as turf from '@turf/turf'
import Track from './utils/Track'
export default {
  data () {
    return {
      roaming: null,
      play: false,
      viewer: null
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the this.viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
    this.viewer = new Cesium.Viewer('cesium-container', {
      terrainProvider: Cesium.createWorldTerrain(),
      animation: false, // 是否显示左下角的仪表盘
      timeline: false, // 是否显示下边的时间轴
      // shouldAnimate: true,
      baseLayerPicker: false, // 是否显示图层选择器按钮，右上角那个地图图标
      fullscreenButton: false, // 是否显示全屏按钮
      vrButton: false, // 是否显示VR按钮
      geocoder: false, // 是否显示搜索按钮
      homeButton: false, // 是否显示主页按钮
      infoBox: false, // 是否显示提示信息
      sceneModePicker: false, // 是否显示右上角的模式切换按钮
      selectionIndicator: false, // 是否显示选取指示器组件
      navigationHelpButton: false, // 是否显示右上角的帮助按钮
      navigationInstructionsInitiallyVisible: true, // 是否显示导航
      // scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
      // requestRenderMode: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
    })
    this.viewer.entities.removeAll()
    points.map((point, index) => {
      // return
      // 添加方向实体
      const toPoint = CesiumUtils.distancePos(point.longitude, point.latitude, point.heading, 20)
      const headingEntity = this.viewer.entities.add(
        new Cesium.Entity({
          id: 'heading' + index,
          name: 'headingLine',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([point.longitude, point.latitude, point.altitude, toPoint.longitude, toPoint.latitude, point.altitude]),
            width: 10,
            material: new Cesium.PolylineArrowMaterialProperty(
              new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
            ),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
          }
        })
      )
      // 点
      const entity = this.viewer.entities.add(new Cesium.Entity({
        id: 'point' + point.id,
        name: 'point',
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        data: {
          point
        },
        billboard: {
          image: require('@/assets/images/point.png'),
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          scale: 0.5,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          show: true
        },
        label: {
          text: point.id + '',
          fillColor: new Cesium.Color.fromCssColorString('#fff'),
          outlineColor: new Cesium.Color.fromCssColorString('#fff'),
          outlineWidth: 0.5,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          showBackground: true,
          backgroundColor: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0),
          // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          show: true
        }
      }))
    })

    // 线
    const _list = []
    points.map((point, index) => {
      _list.push(point.longitude)
      _list.push(point.latitude)
      _list.push(point.altitude)
    })
    const lineEntity = this.viewer.entities.add(
      new Cesium.Entity({
        id: 'line',
        name: 'line',
        polyline: {
          // positions: Cesium.Cartesian3.fromDegreesArray([116.3, 39.9, 116.47958024969756, 39.84829594348535, 116.56374186776782, 39.87785704033606]), // 无高度，贴地
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(_list),
          width: 4,
          arcType: Cesium.ArcType.RHUMB,
          material: new Cesium.PolylineDashMaterialProperty({
            color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1),
            dashLength: 10
          }),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
        }
      })
    )
    this.viewer.flyTo(lineEntity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(-30),
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(0)
      )
    })

    this.roaming = new Track(this.viewer, {
      points: points,
      shootCallback: function (shootId) {
        console.log('.......shootCallback', shootId)
      }
    })
    this.roaming.Init()
  },
  methods: {
    handleRestart () {
      this.roaming.Restart()
    },
    handlePlay () {
      this.play = !this.play
      if (this.play) {
        this.roaming.Play()
      } else {
        this.roaming.Pause()
      }
    }
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

