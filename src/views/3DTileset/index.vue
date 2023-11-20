<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    />
    <div class="btns">
      <i @click="handleClick">
        {{ cut ? '内部裁切' : '外部裁切' }}
      </i>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { cartesianToLongAndLat } from '@/utils/CesiumUtils/common.js'
import { cutModelByPolygon } from '@/utils/ClippingPlane'
export default {
  data() {
    return {
      cut: false,
      tileset: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    // const _this = this
    // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
    // Initialize the viewer widget with several custom options and mixins.

    // 添加 3DTileset
    this.tileset = new Cesium.Cesium3DTileset({
      url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
      // url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
      // url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
      // url: 'https://lab.earthsdk.com/model/de2a2300ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔（单体）
      // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(this.tileset)
    this.tileset.readyPromise
      .then(async tileset => {
        const boundingSphere = tileset.boundingSphere

        // * 中心点
        const center = boundingSphere.center
        addEntity(center, '中心点')

        // * 最高点
        const result = await Cesium.sampleTerrainMostDetailed(
          viewer.terrainProvider,
          [center]
        )
        addEntity(result[0], '最高点')

        // * 半径加中心点
        // viewer.entities.add(
        //   new Cesium.Entity({
        //     position: center,
        //     ellipsoid: {
        //       radii: new Cesium.Cartesian3(
        //         boundingSphere.radius,
        //         boundingSphere.radius,
        //         boundingSphere.radius
        //       ),
        //       material: new Cesium.PolylineGlowMaterialProperty({
        //         color: Cesium.Color.AZURE
        //       })
        //     }
        //   })
        // )

        // * 顶点
        const halfAxes =
          tileset.root.boundingVolume._orientedBoundingBox.halfAxes
        const x = new Cesium.Cartesian3()
        const y = new Cesium.Cartesian3()
        const z = new Cesium.Cartesian3()

        Cesium.Matrix3.getColumn(halfAxes, 0, x)
        Cesium.Matrix3.getColumn(halfAxes, 1, y)
        Cesium.Matrix3.getColumn(halfAxes, 2, z)

        const temp1 = new Cesium.Cartesian3()
        const temp2 = new Cesium.Cartesian3()
        const temp3 = new Cesium.Cartesian3()

        Cesium.Cartesian3.subtract(center, x, temp1)
        Cesium.Cartesian3.subtract(temp1, y, temp2)
        Cesium.Cartesian3.subtract(temp2, z, temp3)

        addEntity(temp1, 1)
        addEntity(temp2, 2)
        addEntity(temp3, 3)

        const temp4 = new Cesium.Cartesian3()
        const temp5 = new Cesium.Cartesian3()
        const temp6 = new Cesium.Cartesian3()

        Cesium.Cartesian3.add(center, x, temp4)
        Cesium.Cartesian3.add(temp4, y, temp5)
        Cesium.Cartesian3.add(temp5, z, temp6)

        addEntity(temp4, 4)
        addEntity(temp5, 5)
        addEntity(temp6, 6)
      })
      .catch(error => {
        console.log(error)
        this.$confirm('无法加载 tileset，去处理？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            window.open('https://lab.earthsdk.com/model/', '_blank')
          })
          .catch(() => {})
      })
    viewer.zoomTo(this.tileset) // 视角切换到模型的位置

    function addEntity(position, label) {
      viewer.entities.add(
        new Cesium.Entity({
          position: position,
          point: {
            color: Cesium.Color.RED,
            pixelSize: 10
          },
          label: {
            text: `${label}`,
            pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: new Cesium.Color.fromCssColorString('#fff'),
            outlineColor: new Cesium.Color.fromCssColorString('#000'),
            outlineWidth: 1,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            showBackground: false
          }
        })
      )
    }

    // const new_tileset = new Cesium.Cesium3DTileset({
    //   // url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
    //   url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
    //   // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
    //   debugShowMemoryUsage: false
    // })
    // viewer.scene.primitives.add(new_tileset)

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
  },
  methods: {
    handleClick() {
      this.cut = !this.cut
      if (this.cut) {
        // 裁切模型
        cutModelByPolygon(
          this.tileset,
          [
            [108.95894311437783, 34.22035032161717],
            [108.96006120806729, 34.22033432773524],
            [108.96003202722433, 34.21938510624817],
            [108.95885692316273, 34.21942298461592],
            [108.95894311437783, 34.22035032161717]
          ],
          // [
          //   [121.49260265519028, 31.242117807041236],
          //   [121.51355676668399, 31.245032122784824],
          //   [121.51871163020894, 31.232316199923016],
          //   [121.50450627122848, 31.227712061479057],
          //   [121.49406078139155, 31.238990131267578]
          // ],
          true // 外部裁切
        )
      } else {
        cutModelByPolygon(
          this.tileset,
          [
            // [121.49260265519028, 31.242117807041236],
            // [121.51355676668399, 31.245032122784824],
            // [121.51871163020894, 31.232316199923016],
            // [121.50450627122848, 31.227712061479057],
            // [121.49406078139155, 31.238990131267578]
            [108.95894311437783, 34.22035032161717],
            [108.96006120806729, 34.22033432773524],
            [108.96003202722433, 34.21938510624817],
            [108.95885692316273, 34.21942298461592],
            [108.95894311437783, 34.22035032161717]
          ],
          false // 内部裁切
        )
      }
    }
  }
}
</script>
