<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;">
    <div
      class="btn_container">
      <button
        id="getPrimitive">查找primitive</button>
      <button
        id="clear">清除primitive</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-reserved-keys */
import { getObjectSize } from '@/utils/getObjectSize'
import {
  debounce,
  includes,
  isEqual,
  findIndex,
  uniq,
  cloneDeep
} from 'lodash'
import * as turf from '@turf/turf'
export default {
  data () {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    const _this = this
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
    const positions = turf.randomPoint(1000, {
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

    // const positions = require('@/assets/mock/positions.json')

    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        70.01180980018789,
        20.12881664932077,
        134.27620577723778,
        50.568644557429835
      )
    })

    // viewer.camera.percentageChanged = 0.00001
    // viewer.camera.changed.addEventListener(function (event) {
    //   console.log(getExtend(viewer))
    // })

    viewer.scene.renderError.addEventListener(function () {
      alert('内存超出100%')
    })

    // ------------------------- Entity
    // 内存：100000个点， 1000M +
    // const BillboardEntity = new Cesium.Entity({
    //   id: 'BillboardEntity',
    //   show: true
    // })
    // viewer.entities.add(BillboardEntity)
    // positions.map((item, index) => {
    //   const entity = new Cesium.Entity({
    //     id: 'BillboardEntity' + index,
    //     position: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude),
    //     show: true,
    //     billboard: {
    //       image: require('@/assets/images/tower.png'),
    //       scale: 0.1,
    //       show: true
    //     },
    //     parent: BillboardEntity
    //   })
    //   viewer.entities.add(entity)
    // })

    // ------------------------- BillboardCollection
    // 内存：100000个点， 143M
    this._BillboardCollection = new Cesium.BillboardCollection()
    this._BillboardCollection.id = '666666'
    viewer.scene.primitives.add(this._BillboardCollection)
    positions.map((point, index) => {
      this._BillboardCollection.add({
        id: 'BillboardCollection' + index,
        image: require('@/assets/images/tower.png'),
        scale: 0.1,
        // scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        // color: Cesium.Color.fromRandom({
        //   alpha: 1.0
        // }),
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
      })
    })
    console.log('viewer.scene.primitives', viewer.scene.primitives)
    console.log('this._BillboardCollection', this._BillboardCollection)

    // ------------------------- PointPrimitiveCollection
    // http://www.bigemap.com/Public/offline/gl/PointPrimitive.html
    // const pointCollection = new Cesium.PointPrimitiveCollection()
    // viewer.scene.primitives.add(pointCollection)
    // positions.map((point, index) => {
    //   const color = Cesium.Color.fromRandom({
    //     alpha: 0.5
    //   })
    //   pointCollection.add({
    //     id: 'point' + index,
    //     position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
    //     pixelSize: 10,
    //     color: color
    //   })
    // })

    const entity = getBillboardsById(this._BillboardCollection, 'BillboardCollection100')
    console.log('.....entity', entity)

    function getBillboardsById (collection, id) {
      let list = []
      // 判断集合类型
      if (collection instanceof Cesium.BillboardCollection) {
        list = collection._billboards
      }
      const index = list.findIndex(_ => _._id === id)
      return list[index]
    }

    document.getElementById('clear').onclick = function () {
      // if (pointCollection) {
      //   pointCollection.destroy()
      //   pointCollection.removeAll()
      // }
      if (_this._BillboardCollection) {
        _this._BillboardCollection.removeAll()
      }
    }

    document.getElementById('getPrimitive').onclick = function () {
      if (_this._BillboardCollection) {
        console.log('_BillboardCollection', _this._BillboardCollection)
        _this._BillboardCollection.get(100).scale = 1
      }
      if (viewer.entities.getById('BillboardEntity100')) {
        console.log('entities', viewer.entities)
        viewer.entities.getById('BillboardEntity100').billboard.scale = 1
      }
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const pick = viewer.scene.pick(event.position)
      if (Cesium.defined(pick) && pick.id) {
        console.log('pick', pick)
        if (pick.id instanceof Cesium.Entity) {
          // 获取到实体
          pick.id.billboard.scale = 1
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
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
