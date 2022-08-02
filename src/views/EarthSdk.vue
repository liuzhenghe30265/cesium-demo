
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
      <div
        class="pub_btn"
        @click="handleMeasureEarth('SPACE_VOLUME')">
        体积测量
      </div>
      <div
        style="margin-top: 5px"
        class="pub_button_li">
        <div
          v-if="!startShow && computing">
          <button
            class="xbsj-button pub_btn"
            @click="buttonClick">
            {{ buttonText }}
          </button>
          <br>
          <span>计算进度:{{ (progress * 100).toFixed(1) }}%</span>
        </div>
        <div
          v-if="!startShow && !computing"
          style="
          width: 218px;
          border-right: 1px solid;
          float: left;
          margin-right: 14px;
        ">
          <button
            class="xbsj-button pub_btn"
            @click="buttonClick">
            {{ buttonText }}
          </button>
          <br>
          <span>计算结果:</span>
          <br>
          <span>采样间距:{{ results.gridWidth.toFixed(2) }}
            m</span>
          <br>
          <span>总面积:{{ results.area.toFixed(2) }}
            ㎡</span>
          <br>
          <span>挖方:{{ results.cut.toFixed(2) }}
            m³</span>
          <br>
          <span>填方:{{ results.fill.toFixed(2) }}
            m³</span>
          <br>
          <span>挖填方:{{ results.total.toFixed(2) }}
            m³</span>
          <br>
        </div>
        <div
          style="width: 252px; float: left">
          <span
            style="vertical-align: middle">采样间距:</span>
          <input
            v-model.number="gridWidth"
            :class="!computing ? '' : 'notInput'"
            class="gridWidth">
          m
          <br>
          <span
            style="vertical-align: middle">基准面高程:</span>
          <input
            v-model.number="height"
            :class="!computing ? '' : 'notInput'"
            class="gridWidth">
          m
          <br>
          <button
            class="xbsj-button pub_btn"
            :disabled="computing"
            @click="startClick">
            开始分析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  data () {
    return {
      text: {
        cancelComputing: '取消计算',
        start: '开始分析',
        reStart: '重新开始'
      },
      startShow: true,
      polygonCreating: false,
      enabled: false,
      status: '',
      progress: 0.0,
      computing: false,
      gridWidth: 1.0,
      height: 0,
      results: {
        gridWidth: 0.0,
        area: 0.0,
        cut: 0.0,
        fill: 0.0,
        total: 0.0
      }
    }
  },
  computed: {
    buttonText () {
      // 如果正在计算，返回取消计算
      if (this.computing) {
        return this.text.cancelComputing
      } else {
        return this.text.reStart
      }
    }
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

    const viewer = earth.czm.viewer
    viewer.scene3DOnly = true
    window.viewer = viewer

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

    const tileset = new Cesium.Cesium3DTileset({
      url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
      debugShowMemoryUsage: false
    })
    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset) // 视角切换到模型的位置

    // earth.camera.flyAround([2.1206125026580582, 0.545178729438238, 15], 3000, [0, -Math.PI / 5, 0], 0, 3.14 / 50)
  },
  methods: {
    startClick () {
      if (this._cutFillComputing.positions.length !== 2) {
        this._cutFillComputing.compute()
        this.startShow = false
      } else {
        return
      }
    },
    buttonClick () {
      // 清空结果 停止
      this._cutFillComputing.clearResults()
      this._cutFillComputing.polygonCreating = false
      this._cutFillComputing.positions = []
      // 下一个帧再次开始
      this.$nextTick(() => {
        this._cutFillComputing.polygonCreating = true
        this.startShow = true
      })
    },
    handleMeasureEarth (val) {
      if (val === 'clear') {
        earth.analyzation.measurement.clearResults()
        return
      }
      if (val === 'SPACE_VOLUME') {
        // 体积测量
        this._cutFillComputing = earth.analyzation.cutFillComputing
        this._disposers = []
        const props = [
          'polygonCreating',
          'progress',
          'computing',
          'gridWidth',
          'height',
          'results.gridWidth',
          'results.area',
          'results.cut',
          'results.fill',
          'results.total'
        ]
        props.forEach((p) => {
          this._disposers.push(XE.MVVM.bind(this, p, this._cutFillComputing, p))
        })
        this._cutFillComputing.polygonCreating = true
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
  z-index: 9;
  top: 50px;
  right: 50px;
  padding: 20px;
  .pub_btn {
    cursor: pointer;
    color: #ffffff;
  }
}
button {
  font-family: '宋体';
  font-size: 21px;
  width: 114px;
  height: 31px;
  margin: 5px 0;
  cursor: pointer;
}
.gridWidth {
  font-size: 16px;
  width: 70px;
  padding: 0 5px;
}
.notInput {
  pointer-events: none;
  background: gray;
}
.xbsj-button {
  font-family: SourceHanSansCN-Normal;
  font-size: 14px;
  line-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 32px;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.1s;
  color: #ffffff;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.36);
  backdrop-filter: blur(10px);
}
.xbsj-button:disabled {
  cursor: not-allowed;
}
</style>
