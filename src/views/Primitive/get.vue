<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%"
  >
    <div class="btn_container">
      <button id="getGeometryInstanceAttributes">
        通过id查找Geometry并改变样式
      </button>
      <button id="getPrimitive">查找primitive</button>
      <button id="clear">清除primitive</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-reserved-keys */
import { getObjectSize } from '@/utils/getObjectSize'
import * as turf from '@turf/turf'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      _primitive: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const _this = this

    window.$InitMap()

    // 随机生成坐标
    const positions = turf
      .randomPoint(100, {
        bbox: [
          70.01180980018789, 20.12881664932077, 134.27620577723778,
          50.568644557429835
        ]
        // bbox: [
        //   114.72692258196378,
        //   38.1023045206586,
        //   119.02498669643339,
        //   40.94067311600792
        // ]
      })
      .features.map((_, index) => {
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

    // viewer.camera.percentageChanged = 0.00001
    // viewer.camera.changed.addEventListener(function (event) {
    //   console.log(getExtend(viewer))
    // })

    viewer.scene.renderError.addEventListener(function () {
      alert('内存超出100%')
    })

    // Primitive 方式

    // 单个添加
    // const instance1 = new Cesium.GeometryInstance({
    //   geometry: new Cesium.RectangleGeometry({
    //     rectangle: Cesium.Rectangle.fromDegrees(
    //       positions[0].longitude,
    //       positions[0].latitude,
    //       positions[0].longitude + 1.0,
    //       positions[0].latitude + 1.0
    //     ),
    //     // rectangle: Cesium.Rectangle.fromDegrees(117.5091325944274, 38.38624847508735, 117.6091325944274, 38.48624847508735),
    //     vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
    //   }),
    //   attributes: {
    //     color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
    //   }
    // })
    // const instance2 = new Cesium.GeometryInstance({
    //   geometry: new Cesium.RectangleGeometry({
    //     rectangle: Cesium.Rectangle.fromDegrees(
    //       positions[10].longitude,
    //       positions[10].latitude,
    //       positions[10].longitude + 1.0,
    //       positions[10].latitude + 1.0
    //     ),
    //     // rectangle: Cesium.Rectangle.fromDegrees(116.77941010807417, 38.94292632334566, 116.87941010807417, 38.99292632334566),
    //     vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
    //   }),
    //   attributes: {
    //     color: new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
    //   }
    // })
    // viewer.scene.primitives.add(
    //   new Cesium.Primitive({
    //     geometryInstances: [instance1, instance2],
    //     // appearance: new Cesium.EllipsoidSurfaceAppearance({
    //     //   material: Cesium.Material.fromType('Stripe')
    //     // })
    //     appearance: new Cesium.PerInstanceColorAppearance()
    //   })
    // )

    // 合并多个 GeometryInstances 为一个 Primitive 可以极大的提高性能
    const instances = []
    positions.map((point, index) => {
      instances.push(
        new Cesium.GeometryInstance({
          geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(
              point.longitude,
              point.latitude,
              point.longitude + 0.8,
              point.latitude + 0.8
            ),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
          }),
          id: 'instance' + index,
          attributes: {
            color: new Cesium.ColorGeometryInstanceAttribute(
              1.0,
              0.0,
              0.0,
              0.5
            ),
            show: new Cesium.ShowGeometryInstanceAttribute(true)
          }
        })
      )
    })

    // GroundPrimitive 贴地
    this._primitive = new Cesium.GroundPrimitive({
      releaseGeometryInstances: false,
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true, // 当true时，片段着色中使用平面着色，这意味着不考虑照明。
        translucent: true // 当true时，几何体将显示为半透明
        // closed: true
      })
    })

    // 向已有的 Primitive 中添加
    this._primitive.geometryInstances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArrayHeights([
              100.94576388050478, 45.75803731315555, 0, 113.89723121788089,
              47.18650638246618, 0, 104.52391179882419, 40.751895958199555, 0
            ])
          ),
          perPositionHeight: true,
          closeTop: true,
          closeBottom: true,
          arcType: Cesium.ArcType.RHUMB,
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
        }),
        id: 'instance' + 66666,
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 1.0),
          show: new Cesium.ShowGeometryInstanceAttribute(true)
        }
      })
    )
    console.log('sizeof', getObjectSize(this._primitive))
    /**
     * viewer.scene.primitives 方法 http://www.bigemap.com/Public/offline/gl/PrimitiveCollection.html
     * remove(this._primitive) // 清除指定 primitive
     * removeAll() // 清除所有 primitive
     */
    viewer.scene.primitives.add(this._primitive)

    document.getElementById('getGeometryInstanceAttributes').onclick =
      function () {
        // 随机选取一个 Geometry 改变颜色，设置显隐
        const radom = Math.floor(Math.random() * 100)
        const attributes = _this._primitive.getGeometryInstanceAttributes(
          'instance' + radom
        )
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          Cesium.Color.fromRandom({
            alpha: 1.0
          })
        )
        setTimeout(() => {
          // 设置显隐
          attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(false)
        }, 2000)
        setTimeout(() => {
          // 设置显隐
          attributes.show = Cesium.ShowGeometryInstanceAttribute.toValue(true)
        }, 4000)
      }

    document.getElementById('clear').onclick = function () {
      viewer.scene.primitives.remove(_this._primitive)
    }

    document.getElementById('getPrimitive').onclick = function () {
      console.log(_this._primitive.geometryInstances)
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const pick = viewer.scene.pick(event.position)
      if (Cesium.defined(pick) && pick.id) {
        console.log('pick', pick)
        const attributes = _this._primitive.getGeometryInstanceAttributes(
          pick.id
        )

        // 改变颜色
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
          Cesium.Color.fromRandom({
            alpha: 1.0
          })
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {}
}
</script>

<style>
.btn_container {
  position: absolute;
  z-index: 9;
  top: 50px;
  right: 50px;
  padding: 20px;
}
</style>
