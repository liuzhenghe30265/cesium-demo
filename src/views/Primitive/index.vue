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
/* eslint-disable vue/no-reserved-keys */
import * as turf from '@turf/turf'
export default {
  data () {
    return {
      _primitive: null
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
    const positions = turf.randomPoint(10000, {
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
        altitude: index,
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
    //   const entity = new Cesium.Entity({
    //     id: 'bar' + index,
    //     position: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude),
    //     show: true,
    //     cylinder: {
    //       topRadius: 1000,
    //       bottomRadius: 1000,
    //       heightReference: 0,
    //       length: 100000,
    //       material: new Cesium.ColorMaterialProperty(Cesium.Color.fromRandom({
    //         alpha: 0.5
    //       })),
    //       show: true
    //     },
    //     parent: barEntity
    //   })
    //   viewer.entities.add(entity)
    // })

    // Primitive
    const instances = []
    positions.map((point, index) => {
      // 图片
      instances.push(
        new Cesium.GeometryInstance({
          id: 'CylinderGeometry' + index,
          geometry: new Cesium.CylinderGeometry({
            length: 10000,
            topRadius: 1000,
            bottomRadius: 1000
          }),
          modelMatrix: Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(
              Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)), new Cesium.Cartesian3(0.0, 0.0, 0.0), new Cesium.Matrix4()
          ),
          attributes: {
            color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('#0000ff').withAlpha(0.4)),
            show: new Cesium.ShowGeometryInstanceAttribute(true)
          }
        })
      )
      // // 圆柱、圆锥或者截断的圆锥
      // instances.push(
      //   new Cesium.GeometryInstance({
      //     id: 'CylinderGeometry' + index,
      //     geometry: new Cesium.CylinderGeometry({
      //       length: 10000,
      //       topRadius: 1000,
      //       bottomRadius: 1000
      //     }),
      //     modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      //       Cesium.Transforms.eastNorthUpToFixedFrame(
      //         Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)), new Cesium.Cartesian3(0.0, 0.0, 0.0), new Cesium.Matrix4()
      //     ),
      //     attributes: {
      //       color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('#0000ff').withAlpha(0.4)),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     }
      //   })
      // )
      // // 圆形或者拉伸的圆形，圆圈或挤压圆
      // instances.push(
      //   new Cesium.GeometryInstance({
      //     id: 'CircleGeometry' + index,
      //     geometry: new Cesium.CircleGeometry({
      //       center: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
      //       radius: 5000
      //     }),
      //     attributes: {
      //       color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     }
      //   })
      // )
      // // 仅有轮廓的立方体，只有外部线条的的盒子
      // instances.push(
      //   new Cesium.GeometryInstance({
      //     id: 'BoxOutlineGeometry' + index,
      //     geometry: new Cesium.BoxOutlineGeometry.fromDimensions({
      //       vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
      //       dimensions: new Cesium.Cartesian3(10000.0, 10000.0, 50000.0) // 分别存储在Cartesian3的x、y和z坐标中的框的宽度、深度和高度。
      //     }),
      //     modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
      //       Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)), new Cesium.Cartesian3(0.0, 0.0, 1000.0), new Cesium.Matrix4()),
      //     attributes: {
      //       color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     }
      //   })
      // )
      // // 立方体
      // instances.push(
      //   new Cesium.GeometryInstance({
      //     id: 'BoxGeometry' + index,
      //     geometry: new Cesium.BoxGeometry.fromDimensions({
      //       vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
      //       dimensions: new Cesium.Cartesian3(10000.0, 10000.0, 50000.0) // 分别存储在Cartesian3的x、y和z坐标中的框的宽度、深度和高度。
      //     }),
      //     modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
      //       Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)), new Cesium.Cartesian3(0.0, 0.0, 1000.0), new Cesium.Matrix4()),
      //     attributes: {
      //       color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     }
      //   })
      // )
      // // 矩形
      // instances.push(
      //   new Cesium.GeometryInstance({
      //     id: 'BoxGeometry' + index,
      //     geometry: new Cesium.RectangleGeometry({
      //       rectangle: Cesium.Rectangle.fromDegrees(point.longitude, point.latitude, point.longitude + 0.10, point.latitude + 0.10),
      //       vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
      //     }),
      //     attributes: {
      //       color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
      //       show: new Cesium.ShowGeometryInstanceAttribute(true)
      //     }
      //   })
      // )
    })
    // 走廊：沿着地表的多段线(垂直于表面的折线)，且具有一定的宽度，可以拉伸到一定的高度
    instances.push(
      new Cesium.GeometryInstance({
        id: 'CorridorGeometry',
        geometry: new Cesium.CorridorGeometry({
          vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
          positions: Cesium.Cartesian3.fromDegreesArray([positions[0].longitude, positions[0].latitude, positions[10].longitude, positions[10].latitude]),
          width: 10000
        }),
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5),
          show: new Cesium.ShowGeometryInstanceAttribute(true)
        }
      })
    )
    this._primitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        // translucent: false,
        // closed: true
      })
    })
    viewer.scene.primitives.add(this._primitive)

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const pick = viewer.scene.pick(event.position)
      if (Cesium.defined(pick) && pick.id) {
        console.log('pick', pick)
        const attributes = _this._primitive.getGeometryInstanceAttributes(pick.id)
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          Cesium.Color.fromRandom({
            alpha: 1.0
          })
        )
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
