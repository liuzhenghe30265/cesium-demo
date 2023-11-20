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

    // 获取3DTiles数据集的边界球体
    var boundingSphere = this.tileset.tilesetBoundingSphere
    console.log('.............boundingSphere', boundingSphere)

    // 获取3DTiles数据集的边界框
    var boundingBox = this.tileset.tilesetBoundingBox
    console.log('...........boundingBox', boundingBox)

    this.tileset.tileVisible.addEventListener(function (tile) {
      var content = tile.content
      var featuresLength = content.featuresLength
      console.log('...........featuresLength', featuresLength)
      // for (var i = 0; i < featuresLength; ++i) {
      //   var feature = content.getFeature(i)
      //   var geometry = feature.geometry
      //   var positions = geometry.boundingSphereWC.positions
      //   console.log(positions)
      // }
    })

    viewer.scene.primitives.add(this.tileset)
    this.tileset.readyPromise
      .then(async tileset => {
        console.log('............tileset', tileset)

        var properties = tileset.properties
        console.log('.............properties', properties)
        if (Cesium.defined(properties)) {
          for (var name in properties) {
            console.log('............', properties[name])
          }
        }

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

        // * 顶点 v2
        const verticesPosition = {}
        const radius = 100
        const centerPosition = cartesianToLongAndLat(center)
        for (let index = 0; index < 10; index++) {
          const angle = index * 36
          const endPosition = getLonAndLat(
            centerPosition.longitude,
            centerPosition.latitude,
            angle,
            radius
          )
          const _position = Cesium.Cartesian3.fromDegrees(
            endPosition.longitude,
            endPosition.latitude,
            centerPosition.altitude
          )
          verticesPosition[angle] = endPosition
          addEntity(_position, index)
        }

        // * 顶点 v1
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
        // this.$confirm('无法加载 tileset，去处理？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        //   .then(() => {
        //     window.open('https://lab.earthsdk.com/model/', '_blank')
        //   })
        //   .catch(() => {})
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

    function getLonAndLatV2(longitude, latitude, angle, distance) {
      var _angle = Cesium.Math.toRadians(angle) // 角度以弧度为单位
      var end = Cesium.Cartesian3.fromDegrees(
        longitude + distance * Math.cos(_angle),
        latitude,

        distance * Math.sin(_angle)
      )

      // 将新的坐标转换回经纬度
      var endLatLon = Cesium.Cartographic.fromCartesian(end)
      var endLat = Cesium.Math.toDegrees(endLatLon.latitude)
      var endLon = Cesium.Math.toDegrees(endLatLon.longitude)
      return {
        longitude: endLon,
        latitude: endLat
      }
    }

    const getLonAndLat = function (lng, lat, brng, dist) {
      /**
       * 根据一个经纬度及距离角度，算出另外一个经纬度
       * @param {*} lng 经度 113.3960698
       * @param {*} lat 纬度 22.941386
       * @param {*} brng 方位角 45 ---- 正北方：000°或360° 正东方：090° 正南方：180° 正西方：270°
       * @param {*} dist 90000距离(米)
       *
       */
      function rad(d) {
        return (d * Math.PI) / 180.0
      }

      /**
       * 弧度换成度
       * @param  {Float} x 弧度
       * @return {Float}   度
       */
      function deg(x) {
        return (x * 180) / Math.PI
      }
      // 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
      var a = 6378137
      var b = 6356752.3142
      var f = 1 / 298.257223563

      var lon1 = lng * 1
      var lat1 = lat * 1
      var s = dist
      var alpha1 = rad(brng)
      var sinAlpha1 = Math.sin(alpha1)
      var cosAlpha1 = Math.cos(alpha1)

      var tanU1 = (1 - f) * Math.tan(rad(lat1))
      var cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1)
      var sinU1 = tanU1 * cosU1
      var sigma1 = Math.atan2(tanU1, cosAlpha1)
      var sinAlpha = cosU1 * sinAlpha1
      var cosSqAlpha = 1 - sinAlpha * sinAlpha
      var uSq = (cosSqAlpha * (a * a - b * b)) / (b * b)
      var A =
        1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
      var B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

      var sigma = s / (b * A)
      var sigmaP = 2 * Math.PI
      while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
        var sinSigma = Math.sin(sigma)
        var cosSigma = Math.cos(sigma)
        var deltaSigma =
          B *
          sinSigma *
          (cos2SigmaM +
            (B / 4) *
              (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                (B / 6) *
                  cos2SigmaM *
                  (-3 + 4 * sinSigma * sinSigma) *
                  (-3 + 4 * cos2SigmaM * cos2SigmaM)))
        sigmaP = sigma
        sigma = s / (b * A) + deltaSigma
      }

      var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
      var lat2 = Math.atan2(
        sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
      )
      var lambda = Math.atan2(
        sinSigma * sinAlpha1,
        cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
      )
      var C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
      var L =
        lambda -
        (1 - C) *
          f *
          sinAlpha *
          (sigma +
            C *
              sinSigma *
              (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

      // var revAz = Math.atan2(sinAlpha, -tmp) // final bearing
      return { longitude: lon1 + deg(L), latitude: deg(lat2) }
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
