<template>
  <div style="width: 100%; height: 100%;">
    <div
      id="cesium-container"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
import { GetAutoWaypoint } from '@/utils/AutoWaypoint'
import {
  GetMouseEarthPosition,
  cartesianToLongAndLat
} from '@/utils/CesiumUtils/common'
import { GetCesiumVersion, screenTo3D } from 'lk-cesium-utils'
import * as CesiumUtils from 'lk-cesium-utils'
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

    viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: '',
        debugShowMemoryUsage: false
      })
    )

    // 添加 3DTileset
    this.tileset = new Cesium.Cesium3DTileset({
      url: '',
      //   url: '/model/truck/good/terra_b3dms/tileset.json',
      debugShowMemoryUsage: false
    })

    viewer.scene.primitives.add(this.tileset)
    this.tileset.readyPromise
      .then(async tileset => {})
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

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      console.log('.........event', event, screenTo3D(event.position))
      // const position = cartesianToLongAndLat(
      //   GetMouseEarthPosition(event.position).earthPosition
      // )
      // const result = GetAutoWaypoint(position)
      // console.log('..............result', result)
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  },
  methods: {}
}
</script>