<template>
  <div style="width: 100%; height: 100%">
    <div id="cesium-container" style="width: 100%; height: 100%" />
    <el-image
      ref="preview"
      :src="url"
      :preview-src-list="srcList"
      style="display: none"
    />
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import '@/utils/PolylineTrailMaterialProperty'
import {
  makeCurve,
  scaleAnimate,
  opacityAnimate,
  colorOpacityAnimate,
  semiMinorAxisAnimate,
  semiMajorAxisAnimate
} from '@/utils/EntityAnimate'
import {
  translateByDirection,
  getVector,
  distancePos
} from '@/utils/CesiumUtils.js'
export default {
  data() {
    return {
      srcList: [],
      url: '',
      points: [
        {
          id: 102881,
          latitude: 31.85376,
          longitude: 120.217137,
          altitude: 90,
          heading: -2,
          action: [
            {
              src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              id: 164260,
              yaw: 100,
              roll: 100,
              pitch: 100
            }
          ]
        },
        {
          id: 102882,
          latitude: 31.8554312,
          longitude: 120.216864,
          altitude: 82.5,
          heading: 90,
          action: []
        },
        {
          id: 102883,
          latitude: 31.8556587,
          longitude: 120.2185077,
          altitude: 92.6,
          heading: 180,
          action: [
            {
              src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              id: 164262,
              yaw: 0,
              roll: 0,
              pitch: 45
            }
          ]
        },
        {
          id: 102884,
          latitude: 31.856109,
          longitude: 120.2218049,
          altitude: 93.4,
          heading: 270,
          action: []
        },
        {
          id: 102886,
          latitude: 31.8559722,
          longitude: 120.2218505,
          altitude: 62.27,
          heading: 360,
          action: [
            {
              src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              id: 164264,
              yaw: 0,
              roll: 0,
              pitch: 1.7
            }
          ]
        },
        {
          id: 102887,
          latitude: 31.8559748,
          longitude: 120.2218342,
          altitude: 58.18,
          heading: 270,
          action: [
            {
              src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              id: 164266,
              yaw: -1.4,
              roll: 0,
              pitch: 1.9
            }
          ]
        },
        {
          id: 102888,
          latitude: 31.8559665,
          longitude: 120.2218342,
          altitude: 51.39,
          heading: 180,
          action: [
            {
              src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              id: 164268,
              yaw: -2,
              roll: 0,
              pitch: 1.7
            }
          ]
        },
        {
          id: 102889,
          latitude: 31.8559705,
          longitude: 120.2218332,
          altitude: 44.96,
          heading: 90,
          action: []
        },
        {
          id: 102892,
          latitude: 31.8562512,
          longitude: 120.2217962,
          altitude: 62.04,
          heading: 0,
          action: [
            {
              src: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
              id: 164271,
              yaw: 0,
              roll: 0,
              pitch: 1.7
            }
          ]
        },
        {
          id: 102893,
          latitude: 31.8562451,
          longitude: 120.2217842,
          altitude: 58.18,
          heading: 0,
          action: []
        },
        {
          id: 102894,
          latitude: 31.8562542,
          longitude: 120.2217819,
          altitude: 51.42,
          heading: 0,
          action: []
        },
        {
          id: 102895,
          latitude: 31.8562497,
          longitude: 120.2217814,
          altitude: 44.99,
          heading: 0,
          action: [
            {
              src: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
              id: 164276,
              yaw: -2.2,
              roll: 0,
              pitch: 2
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const _this = this
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
      // scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
      // requestRenderMode: true,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
    })

    // 清除实体
    // 方法一：通过 Entity 删除
    // viewer.entities.remove(Entity)
    // 方法二：通过 id 删除
    // viewer.entities.remove(viewer.entities.getById('xxx'))
    // 方法三：删除所有实体
    viewer.entities.removeAll()
    this.points.map((point, index) => {
      if (point.actionEntityList && point.actionEntityList.length > 0) {
        // 添加云台视角
        // point.actionEntityList.map((action, actionIndex) => {
        //   const length = 40
        //   let position = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
        //   const dir = getVector(point, point.heading)
        //   const forward_l = length * Math.cos(action.pitch * Math.PI / 180)
        //   position = translateByDirection(position, dir, forward_l)
        //   const y_offset = length * Math.sin(action.pitch * Math.PI / 180)
        //   const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
        //   const lat = Cesium.Math.toDegrees(cartographic.latitude)
        //   const lon = Cesium.Math.toDegrees(cartographic.longitude)
        //   position = new Cesium.Cartesian3.fromDegrees(lon, lat, point.altitude - y_offset)
        //   const entity = viewer.entities.add(new Cesium.Entity({
        //     position: position,
        //     orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll.fromDegrees(point.heading + action.yaw, 0, -1 * action.pitch)),
        //     box: {
        //       dimensions: new Cesium.Cartesian3(0.3, length * 2, 0.3),
        //       material: new Cesium.PolylineArrowMaterialProperty(
        //         new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
        //       ),
        //       outline: false
        //     }
        //   }))
        //   // 添加云台视角（圆锥）
        //   // const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(point.heading + 90), Cesium.Math.toRadians(Number(action.pitch) + 90), Cesium.Math.toRadians(0))
        //   // const cylinderEntity = viewer.entities.add(
        //   //   new Cesium.Entity({
        //   //     id: 'cylinder' + action.id,
        //   //     name: '圆锥',
        //   //     position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //   //     orientation: Cesium.Transforms.headingPitchRollQuaternion(
        //   //       Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //   //       hpr
        //   //     ),
        //   //     cylinder: {
        //   //       length: 40.0,
        //   //       topRadius: 0.0,
        //   //       bottomRadius: 0.1,
        //   //       heightReference: Cesium.HeightReference.NONE,
        //   //       fill: true,
        //   //       material: new Cesium.Color.fromCssColorString('#ffffff'),
        //   //       outline: false,
        //   //       outlineWidth: 1.0,
        //   //       numberOfVerticalLines: 16,
        //   //       shadows: Cesium.ShadowMode.DISABLED
        //   //       // slices: 4
        //   //     },
        //   //     scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        //   //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
        //   //   })
        //   // )
        // })
      }
      // return
      // 添加方向实体
      const toPoint = distancePos(
        point.longitude,
        point.latitude,
        point.heading,
        20
      )
      const headingEntity = viewer.entities.add(
        new Cesium.Entity({
          id: 'heading' + index,
          name: 'headingLine',
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              point.longitude,
              point.latitude,
              point.altitude,
              toPoint.longitude,
              toPoint.latitude,
              point.altitude
            ]),
            width: 10,
            material: new Cesium.PolylineArrowMaterialProperty(
              new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
            ),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              7000.0
            )
          }
        })
      )
      // 点
      const entity = viewer.entities.add(
        new Cesium.Entity({
          id: 'point' + point.id,
          name: 'point',
          position: Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          ),
          data: {
            point
          },
          // point: new Cesium.PointGraphics({
          //   pixelSize: 4,
          //   heightReference: Cesium.HeightReference.NONE,
          //   color: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(0.4),
          //   outlineColor: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(0.4),
          //   outlineWidth: 1,
          //   pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
          //   translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(500, Number.MAX_VALUE), // 可视高度范围
          //   show: true
          // }),
          billboard: {
            image: require('@/assets/images/point.png'),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scale: 1,
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              7000.0
            ),
            show: true
          },
          label: {
            text: point.id + '',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: new Cesium.Color.fromCssColorString('#f00'),
            outlineColor: new Cesium.Color.fromCssColorString('#fff'),
            outlineWidth: 1,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            showBackground: false,
            backgroundColor: new Cesium.Color.fromCssColorString('#fff'),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0.0,
              7000.0
            ),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            show: true
          }
          // 圆柱
          // cylinder: {
          //   topRadius: 10,
          //   bottomRadius: 100,
          //   heightReference: 0,
          //   length: 1000,
          //   material: new Cesium.ImageMaterialProperty({
          //     image: require('@/assets/images/circle.png'),
          //     repeat: new Cesium.Cartesian2(1.0, 1.0),
          //     transparent: true,
          //     color: new Cesium.CallbackProperty(function () {
          //       return Cesium.Color.WHITE.withAlpha(0.5)
          //     }, false)
          //   }),
          //   // material: new Cesium.Color(0.21, 0.66, 1, 0.4),
          //   show: true
          // }
          // 立方体
          // box: {
          //   dimensions: new Cesium.Cartesian3(100.0, 100.0, 100.0),
          //   material: new Cesium.Color.fromCssColorString('#fcb718').withAlpha(0.5),
          //   outline: true,
          //   outlineColor: new Cesium.Color.fromCssColorString('#fcb718')
          // }
        })
      )

      /**
      // 扩展（航点动作上拍照图片）
      if (point.action && point.action.length > 0) {
        point.action.map((action) => {
          const entity = viewer.entities.add(new Cesium.Entity({
            id: 'action' + action.id,
            name: 'action',
            position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            // orientation: Cesium.Transforms.headingPitchRollQuaternion(
            //   Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            //   new Cesium.HeadingPitchRoll(action.yaw, action.pitch, action.roll)
            // ),
            data: {
              action
            },
            plane: {
              plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, -50.0),
              dimensions: new Cesium.Cartesian2(100.0, 80.0),
              material: new Cesium.ImageMaterialProperty({
                image: action.src, // 图片以材质的方式填充
                repeat: new Cesium.Cartesian2(1, 1)
              })
            }
            // billboard: {
            //   width: 320,
            //   height: 150,
            //   // image: action.src,
            //   image: require('@/assets/images/pic.jpeg'),
            //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
            //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            //   // scale: 0.2,
            //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
            //   show: true
            // }
          }))
        })
      }
       */
    })

    // 线
    const _list = []
    this.points.map((point, index) => {
      _list.push(point.longitude)
      _list.push(point.latitude)
      _list.push(point.altitude)
    })
    // fromDegreesArrayHeights 计算出图形面的中点
    const polygon = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights(_list)
      )
    })
    const geometry = Cesium.PolygonGeometry.createGeometry(polygon)
    const center = geometry.boundingSphere.center
    const cartographic = Cesium.Cartographic.fromCartesian(
      center,
      viewer.scene.globe.ellipsoid,
      new Cesium.Cartographic()
    )
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    const entity = viewer.entities.add(
      new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
        point: new Cesium.PointGraphics({
          pixelSize: 40,
          heightReference: Cesium.HeightReference.NONE,
          color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1),
          outlineColor: new Cesium.Color.fromCssColorString(
            '#FCB718'
          ).withAlpha(1),
          outlineWidth: 1,
          pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
          show: true
        })
      })
    )

    const lineEntity = viewer.entities.add(
      new Cesium.Entity({
        id: 'line',
        name: 'line',
        polyline: {
          // positions: Cesium.Cartesian3.fromDegreesArray([116.3, 39.9, 116.47958024969756, 39.84829594348535, 116.56374186776782, 39.87785704033606]), // 无高度，贴地
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(_list),
          width: 2,
          arcType: Cesium.ArcType.RHUMB,
          material: new Cesium.PolylineDashMaterialProperty({
            color: new Cesium.Color.fromCssColorString('#FCB718').withAlpha(1),
            dashLength: 5 // 短划线长度
          }),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            7000.0
          )
        }
      })
    )
    viewer.flyTo(lineEntity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(-30),
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(0)
      )
    })

    // 动画效果

    // 圆环扩散效果
    // http://www.bigemap.com/Public/offline/gl/EllipseGeometry.html?classFilter=ellipse
    const point1 = this.points[0]
    const point2 = this.points[1]
    const point3 = this.points[2]

    // 方式一：颜色填充
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        point1.longitude,
        point1.latitude,
        point1.altitude
      ),
      ellipse: {
        // semiMinorAxis: 500, // 椭圆半短轴的长度，单位为米
        // semiMajorAxis: 500, // 椭圆半长轴的长度，单位为米
        semiMinorAxis: semiMinorAxisAnimate(), // 动态效果
        semiMajorAxis: semiMajorAxisAnimate(),
        height: 100,
        material: Cesium.Color.RED.withAlpha(0.5),
        outlineColor: Cesium.Color.RED
        // extrudedHeight: undefined
      }
    })

    // 方式二：使用图片
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        point2.longitude,
        point2.latitude,
        point2.altitude
      ),
      ellipse: {
        semiMinorAxis: semiMinorAxisAnimate(), // 动态效果
        semiMajorAxis: semiMajorAxisAnimate(),
        height: point2.altitude,
        material: new Cesium.ImageMaterialProperty({
          image: require('@/assets/images/circle.png'),
          repeat: new Cesium.Cartesian2(1.0, 1.0),
          transparent: true,
          color: colorOpacityAnimate()
        })
      }
    })

    // 获取到实体添加动画
    const entity1 = viewer.entities.getById('point' + 102883)
    entity1.billboard.color = opacityAnimate()
    entity1.billboard.scale = scaleAnimate()

    // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // handler.setInputAction(function (event) {
    //   const picked = viewer.scene.pick(event.position)
    //   console.log(picked)
    //   const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
    //   const cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
    //   const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    //   const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    //   console.log('空间直角坐标系转经纬度', longitude, latitude, cartographic.height)
    //   if (!picked || !picked.id) {
    //     return
    //   }
    //   if (picked.id.data) {
    //     console.log(picked.id.data)
    //     const data = picked.id.data
    //     if (data.action && data.action.src) {
    //       _this.url = data.action.src
    //       _this.srcList = [_this.url]
    //       setTimeout(() => {
    //         _this.$refs.preview.clickHandler()
    //       }, 100)
    //     }
    //   }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 添加流动线纹理流动纹理
    const flowMaterial = new Cesium.PolylineTrailMaterialProperty({
      color: Cesium.Color.RED,
      duration: 3000,
      trailImage: require('@/assets/images/colors.png')
    })
    const positions = makeCurve(
      Cesium.Cartesian3.fromDegrees(
        point1.longitude,
        point1.latitude,
        point1.altitude
      ),
      Cesium.Cartesian3.fromDegrees(
        point2.longitude,
        point2.latitude,
        point2.altitude
      )
    )
    viewer.entities.add({
      polyline: {
        positions: positions,
        width: 5,
        material: flowMaterial
      }
    })

    // 添加 glb 模型
    const modelEntity = viewer.entities.add({
      name: 'glb 模型',
      position: new Cesium.Cartesian3.fromDegrees(
        point3.longitude,
        point3.latitude,
        point3.altitude
      ),
      model: {
        uri: 'model/Cesium_Air.glb',
        minimumPixelSize: 256,
        maxumunScale: 20000
      }
    })
    // 聚焦模型
    // viewer.trackedEntity = modelEntity
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
