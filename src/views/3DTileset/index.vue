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
      // url: '/model/truck/good/terra_b3dms/tileset.json',
      // url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
      url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
      // url: 'https://lab.earthsdk.com/model/de2a2300ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔（单体）
      // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(this.tileset)
    this.tileset.readyPromise
      .then(async tileset => {
        // 获取3D Tiles的包围盒
        const boundingSphere = tileset.boundingSphere

        // 获取包围盒的中心点
        const center = boundingSphere.center

        const result = await Cesium.sampleTerrainMostDetailed(
          viewer.terrainProvider,
          [center]
        )
        const maxHeightPosition = cartesianToLongAndLat(result[0])
        // console.log('最高点', maxHeightPosition)
        // viewer.entities.add(
        //   new Cesium.Entity({
        //     position: Cesium.Cartesian3.fromDegrees(
        //       maxHeightPosition.longitude,
        //       maxHeightPosition.latitude,
        //       maxHeightPosition.altitude
        //     ),
        //     point: new Cesium.PointGraphics({
        //       pixelSize: 10,
        //       heightReference: Cesium.HeightReference.NONE,
        //       color: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(
        //         1
        //       ),
        //       outlineColor: new Cesium.Color.fromCssColorString(
        //         '#d81e06'
        //       ).withAlpha(1),
        //       outlineWidth: 1
        //     }),
        //     label: {
        //       text: `最高点\n${maxHeightPosition.longitude}\n${maxHeightPosition.latitude}\n${maxHeightPosition.altitude}`,
        //       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //       font: '16px sans-serif',
        //       fillColor: new Cesium.Color.fromCssColorString('#fff'),
        //       outlineColor: new Cesium.Color.fromCssColorString('#333'),
        //       outlineWidth: 1,
        //       verticalOrigin: Cesium.VerticalOrigin.CENTER,
        //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER
        //     }
        //   })
        // )

        // 中心点坐标
        // const centerPosition = cartesianToLongAndLat(center)
        // console.log('中心点', centerPosition)
        // viewer.entities.add(
        //   new Cesium.Entity({
        //     position: Cesium.Cartesian3.fromDegrees(
        //       centerPosition.longitude,
        //       centerPosition.latitude,
        //       maxHeightPosition.altitude
        //     ),
        //     point: new Cesium.PointGraphics({
        //       pixelSize: 10,
        //       heightReference: Cesium.HeightReference.NONE,
        //       color: new Cesium.Color.fromCssColorString('#d81e06').withAlpha(
        //         1
        //       ),
        //       outlineColor: new Cesium.Color.fromCssColorString(
        //         '#d81e06'
        //       ).withAlpha(1),
        //       outlineWidth: 1
        //     }),
        //     label: {
        //       text: `中心点\n${centerPosition.longitude}\n${centerPosition.latitude}\n${centerPosition.altitude}`,
        //       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //       font: '16px sans-serif',
        //       fillColor: new Cesium.Color.fromCssColorString('#fff'),
        //       outlineColor: new Cesium.Color.fromCssColorString('#333'),
        //       outlineWidth: 1,
        //       verticalOrigin: Cesium.VerticalOrigin.CENTER,
        //       horizontalOrigin: Cesium.HorizontalOrigin.CENTER
        //     }
        //   })
        // )
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
            [121.49260265519028, 31.242117807041236],
            [121.51355676668399, 31.245032122784824],
            [121.51871163020894, 31.232316199923016],
            [121.50450627122848, 31.227712061479057],
            [121.49406078139155, 31.238990131267578]
          ],
          true // 外部裁切
        )
      } else {
        cutModelByPolygon(
          this.tileset,
          [
            [121.49260265519028, 31.242117807041236],
            [121.51355676668399, 31.245032122784824],
            [121.51871163020894, 31.232316199923016],
            [121.50450627122848, 31.227712061479057],
            [121.49406078139155, 31.238990131267578]
          ],
          false // 内部裁切
        )
      }
    }
  }
}
</script>
