
<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;">
    <div
      class="btns_container">
      <div
        class="pub_btn"
        @click="handleMeasureEarth('POINT')">
        位置测量
      </div>
      <div
        class="pub_btn"
        @click="handleMeasureEarth('SPACE_DISTANCE')">
        距离测量
      </div>
      <div
        class="pub_btn"
        @click="handleMeasureEarth('SPACE_AREA')">
        面积测量
      </div>
      <div
        class="pub_btn"
        @click="handleMeasureEarth('clear')">
        清除
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  data () {
    return {}
  },
  computed: {

  },
  watch: {

  },
  mounted () {
    const earth = new XE.Earth(document.getElementById('cesium-container'), {
      terrainExaggeration: 1,
      geocoder: false, // 地理位置查询定位控件，默认使用bing地图服务.
      // homeButton: false, //默认相机位置。
      sceneModePicker: false, // 3D、2D和哥伦布模式的切换按钮.
      baseLayerPicker: false, // 选择地形、影像等图层。
      navigationHelpButton: false, // 显示默认的相机控制提示.
      animation: false, // 控制场景动画的播放速度.
      infoBox: false,
      timeline: false, // 时间滚动条。
      shouldAnimate: true,
      homeButton: true,
      fullscreenButton: true,
      requestRenderMode: true,
      scene3DOnly: true,
      useBrowserRecommendedResolution: false,
      selectionIndicator: false, // 绿色锁定框
      useDefaultRenderLoop: true,
      // maximumRenderTimeChange: Infinity,
      orderIndependentTranslucency: false,
      contextOptions: {
        allowTextureFilterAnisotropic: false,
        webgl: {
          alpha: true
        }
      }
    })

    window.earth = earth

    // 添加默认地球影像
    earth.sceneTree.root = {
      children: [{
        czmObject: {
          name: '默认离线影像',
          xbsjType: 'Imagery',
          xbsjImageryProvider: {
            XbsjImageryProvider: {
              url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              srcCoordType: 'WGS84',
              dstCoordType: 'WGS84',
              maximumLevel: 16
            }
          }
        }
      }]
    }
    // 大气层
    // earth.weather.cloud.enabled = true

    const viewer = earth.czm.viewer
    viewer.scene3DOnly = true
    window.viewer = viewer

    const tileset = new Cesium.Cesium3DTileset({
      url: 'https://lab.earthsdk.com/model/3610c2b0d08411eab7a4adf1d6568ff7/tileset.json', // 上海（白）
      // url: 'https://lab.earthsdk.com/model/908311a0ac2f11e99dbd8fd044883638/tileset.json', // 上海（蓝）
      // url: 'https://lab.earthsdk.com/model/f15b9e90ac2d11e99dbd8fd044883638/tileset.json', // 大雁塔
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset)

    const eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    eventHandler.setInputAction(function (event) {
      const picked = viewer.scene.pick(event.position)
      if (picked) {
        if (picked.primitive && picked.primitive._renderedText) {
          console.log('.........picked', picked.primitive._renderedText)
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {
    handleMeasureEarth (val) {
      if (val === 'clear') {
        earth.analyzation.measurement.clearResults()
        return
      }
      earth.analyzation.measurement.type = val
    }
  }
}
</script>

<style lang="scss">
* {
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
}
.btns_container {
  position: absolute;
  right: 50px;
  top: 50px;
  padding: 20px;
  z-index: 9;
  .pub_btn {
    color: #fff;
    cursor: pointer;
  }
}
</style>
