<template>
  <div
    v-drag
    class="route_list_container route_planning_container">
    <i class="route_planning_close el-icon-close"
      @click="handleClose" />
    <div
      class="route_list">
      <div
        class="pub_tit">
        航线列表
      </div>
      <div
        class="rl_list"
        @mousedown="onButtonDown"
        @touchstart="onButtonDown">
        <List
          ref="List"
          :select-index="selectRouteIndex"
          :device-position="devicePosition"
          @select="handleRouteIemClick"
          @deleteSuccess="handleDeleteRouteSuccess"
          @reset="handleRouteListReset" />
      </div>
      <div
        class="pub_button_li">
        <div
          v-if="selectRouteIndex > -1"
          class="pub_btn select"
          @click="handleFlyRoute()">
          <i
            class="icon execute" />
          <span>执行</span>
        </div>
        <div
          v-else
          class="pub_btn select"
          :class="{disabled: selectRouteIndex > -1}"
          @click="handleOpenEditCon('add')">
          <i
            class="icon" />
          <span>新建</span>
        </div>
        <div
          class="pub_btn edit select"
          :class="{disabled: selectRouteIndex === -1}"
          @click="handleOpenEditCon('edit')">
          <i
            class="icon edit" />
          <span>编辑</span>
        </div>
        <div
          class="pub_btn delete"
          :class="{disabled: selectRouteIndex === -1}"
          @click="handleDeleteRoute">
          <i
            class="icon delete" />
          <span>删除</span>
        </div>
      </div>
    </div>
    <el-image
      ref="preview"
      :src="imageUrl"
      :preview-src-list="imageUrlList"
      style="display: none;" />
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import List from './components/List.vue'
import { getPoint } from '@/utils/global/cesiumFunction'
import {
  makeRouteEntities,
  clearRouteEntities
} from '@/utils/hushi/MeasurementUtils/RoutePlanning'
import {
  // uniq,
  // isEqual,
  // includes,
  debounce,
  cloneDeep
} from 'lodash'
import { setProperty } from "@/utils/hushi/httpData.js";
export default {
  name: 'EarthhushiIndex',

  components: {
    List
  },

  data () {
    return {
      imageUrl: '',
      imageUrlList: [],
      imageHandler: null,
      imageEntityList: [], // 变电站通道图片
      // 后场
      // testEntityPsoition: [
      //   {
      //     longitude: '117.7133468',
      //     latitude: '39.0773620',
      //     altitude: 0
      //   },
      //   {
      //     longitude: '117.7133468',
      //     latitude: '39.0773620',
      //     altitude: 0
      //   }
      // ],
      // 慧谷
      testEntityPsoition: [
        {
          longitude: '117.7426971',
          latitude: '39.2020233',
          altitude: 0
        },
        {
          longitude: '117.7426971',
          latitude: '39.2020233',
          altitude: 0
        }
      ],
      $wayPointList: [],
      devicePosition: {}, // 选中机库的坐标
      selectRouteIndex: -1,
      selectRoute: {},
      points: []// 航点列表，发给避障航线
    }
  },

  computed: {
    watchCurrentCurrentRoute () {
      const data = this.$store.state.routePlanning.currentRoute
      return data
    }
  },

  watch: {
  },

  mounted () {
    // this.testEntity()
  },

  beforeDestroy () {
    this.close()
  },

  methods: {
    onButtonDown (event) {
      event.stopPropagation()
    },
    clearTestEntity () {
      if (this.testEntityPsoition.length > 0) {
        this.testEntityPsoition.map((item, index) => {
          viewer.entities.getById('test' + index) ? viewer.entities.remove(viewer.entities.getById('test' + index)) : void (0)
        })
      }
    },
    testEntity () {
      // 测试试题样式互相影响问题
      this.clearTestEntity()
      if (this.testEntityPsoition.length > 0) {
        this.testEntityPsoition.map((point, index) => {
          const entity = viewer.entities.add(new Cesium.Entity({
            id: 'test' + index,
            name: 'wayPoint',
            position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
            data: {
              index
            },
            billboard: {
              image: require('@/assets/images/controls/routePlanning/point.png'),
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              scale: 1,
              scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
              show: true
            },
            label: {
              text: index + '',
              // font: '14px sans-serif',
              fillColor: new Cesium.Color.fromCssColorString('#000'),
              outlineColor: new Cesium.Color.fromCssColorString('#000'),
              outlineWidth: 1,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              showBackground: true,
              backgroundColor: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
              scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
              show: true
            }
          }))
        })
      }
    },
    handleRouteListReset () {
      this.resetAllData()
    },
    // 执行航线
    handleFlyRoute () {
      this.$emit('flyRoute', this.selectRoute.code)
      setProperty(this.$store.state.deviceInfo.cur_drone_id, {
        "labControl": {
          "type": "waypoints",
          "data": this.points
        }
      })
    },
    handleOpenEditCon (type) {
      if (type === 'add') {
        this.$store.commit('routePlanning/updateCurrentRoute', {})
        this.$emit('edit', 'add')
      } else {
        this.$emit('edit', 'edit')
      }
    },
    // 删除航线
    handleDeleteRoute () {
      this.$refs.List.deleteRouteFun(this.selectRoute.routeId)
    },
    handleDeleteRouteSuccess () {
      this.resetAllData()
      this.$store.commit('routePlanning/updateCurrentRoute', {})
    },
    makeRouteEntitiesDebounce: debounce(function (list) {
      makeRouteEntities({
        list: list, // 航点数据
        idPrefix: 'routeList', // 航线所有元素 ID 前缀（用于多处绘制/清除航线）
        fly: true, // 是否定位到航线处
        distanceLabel: true, // 是否显示航线距离标注
        // heading: true, // 是否显示机头朝向
        // action: true, // 是否显示动作朝向
        altitudeLabel: true, // 是否显示海拔
        totalDistance: true // 总航程
      })
    }, 0),
    getWayPointInfo () {
      if (this.selectRoute.code) {
        this.points = [];
        getPoint(this.selectRoute.code).then(res => {
          if (res) {
            res.map(point => {
              point.longitude = Number(parseFloat(point.longitude).toFixed(7))
              point.latitude = Number(parseFloat(point.latitude).toFixed(7))
              point.altitude = Number(point.altitude)
              if (point.actionEntityList && point.actionEntityList.length > 0) {
                point.actionEntityList.map(action => {
                  // 悬停时间转为毫秒
                  action.preTime = action.preTime / 1000
                })
              }
            })
            this.points = res;
            this.$wayPointList = cloneDeep(res)
            this.makeRouteEntitiesDebounce(this.$wayPointList)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    clearImageEntity () {
      if (this.imageEntityList.length > 0) {
        this.imageEntityList.map((entity) => {
          viewer.entities.remove(entity)
        })
      }
      if (this.imageHandler) {
        this.imageHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      }
    },
    // 选中航线
    handleRouteIemClick (item, index) {
      // 解锁飞机
      if (this.$vueSelf.lockDevice) {
        this.$vueSelf.lockDrone(0)
      }
      clearRouteEntities('routeList')
      this.selectRouteIndex =
        this.selectRouteIndex === index
          ? (this.selectRouteIndex = -1)
          : (this.selectRouteIndex = index)
      this.selectRoute = this.selectRouteIndex === -1 ? {} : item
      this.$store.commit('routePlanning/updateCurrentRoute', this.selectRoute)
      if (this.selectRouteIndex > -1) {
        this.getWayPointInfo()
      }
    },
    resetAllData () {
      clearRouteEntities('routeList')
      this.selectRouteIndex = -1
      this.selectRoute = {}
    },
    handleChooseDevice (data) {
      if (data && data.longitude && data.latitude) {
        this.resetAllData()
        this.devicePosition = {
          longitude: data.longitude,
          latitude: data.latitude
        }
      }
    },
    close () {
      this.clearTestEntity()
      this.resetAllData()
      this.$emit('close')
    },
    handleClose () {
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/hushi/RoutePlanning.scss';
</style>
