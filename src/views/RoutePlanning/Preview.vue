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
import * as turf from '@turf/turf'
import {
  init
} from './utils/index'
export default {
  data () {
    return {
      play: false,
      _viewer: null
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the this._viewer widget with several custom options and mixins.
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYTJjNTM1Yy0wZDRjLTRlZWYtYTFkMi1hOGIwNTI2ZGU0MDgiLCJpZCI6ODI5MjAsImlhdCI6MTY0NTE2NDEyOH0.XndixRDpLnRAxnqSNQpT2JofpGyngIUWlmzbG53hEtM'
    this._viewer = new Cesium.Viewer('cesium-container', {
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
    this._viewer.entities.removeAll()
    points.map((point, index) => {
      // return
      // 添加方向实体
      const toPoint = CesiumUtils.distancePos(point.longitude, point.latitude, point.heading, 20)
      const headingEntity = this._viewer.entities.add(
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
      const entity = this._viewer.entities.add(new Cesium.Entity({
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
          scale: 1,
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
    const lineEntity = this._viewer.entities.add(
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
    this._viewer.flyTo(lineEntity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(-30),
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(0)
      )
    })

    this.initClick()
  },
  methods: {
    // viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate
    initClick () {
      const _start = Date.now()
      const viewer = this._viewer
      // 模型沿着轨迹移动（图标移动过的路径变色）
      const moveData = []
      points.map((item, index) => {
        const _time = _start + index * 10000
        moveData.push({
          x: item.longitude,
          y: item.latitude,
          z: item.altitude,
          heading: item.heading,
          time: _time
        })
      })
      // const moveData = [{
      //   time: 1656047671018,
      //   x: 106,
      //   y: 39,
      //   z: 0
      // }, {
      //   time: 1656047771018,
      //   x: 132,
      //   y: 48,
      //   z: 0
      // }, {
      //   time: 1656047871018,
      //   x: 120,
      //   y: 32,
      //   z: 0
      // }]
      const date = new Date(moveData[0].time)
      const start = Cesium.JulianDate.fromDate(date) // 获取第一个点的时间
      viewer.clock.startTime = start // 将多个点的第一个点设为轨迹播放的开始时间
      viewer.clock.currentTime = start // 修改时间轴的当前时间
      // viewer.clock.shouldAnimate = true // 开始播放
      const property = new Cesium.SampledPositionProperty()
      const ori = new Cesium.SampledProperty(Cesium.Quaternion)
      for (let z = 0; z < moveData.length; z++) {
        const item = moveData[z]
        const thisTime = Cesium.JulianDate.fromDate(new Date(item.time))
        const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)
        // 添加每一个链接点的信息，到达的时间以及坐标位置
        property.addSample(thisTime, position)

        // 机头朝向
        const device_hpr = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(Number(item.heading || 0) - 90),
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(0)
        )
        const device_orientation = Cesium.Transforms.headingPitchRollQuaternion(
          position,
          device_hpr
        )
        ori.addSample(thisTime, device_orientation)
      }
      // 设置贴地
      // property.setInterpolationOptions({
      //   interpolationDegree: 2,
      //   interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
      // })
      const times = property._property._times
      const startTime = times[0].clone()
      const stopTime = times[times.length - 1].clone()
      const entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
          start: startTime,
          stop: stopTime
        })]),
        position: property, // 点集
        orientation: ori,
        model: {
          uri: 'model/air.glb',
          scale: 1,
          minimumPixelSize: 90
        },
        path: {
          show: true,
          leadTime: 0,
          trailTime: 60,
          width: 10,
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            taperPower: 0.3,
            color: Cesium.Color.PALEGOLDENROD
          })
        }
      })
      // viewer.trackedEntity = entity
    },
    handleRestart () {
      this._viewer.clock.currentTime = this._viewer.clock.startTime
    },
    handlePlay () {
      /**
      // 加速——速度 * 2：
      viewer.clockViewModel.multiplier *= 2;

      // 减速——速度 / 2
      viewer.clockViewModel.multiplier /= 2;

      // 开始/暂停
      viewer.clock.shouldAnimate = true / false;

      // 重置
      viewer.clock.currentTime = viewer.clock.startTime;

      // 循环/不循环
      // 时间轴执行完后停止（LOOP_STOP为循环，UNBOUNDED为继续读秒）
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
       */
      this.play = !this.play
      if (this.play) {
        this._viewer.clock.shouldAnimate = true
      } else {
        this._viewer.clock.shouldAnimate = false
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

