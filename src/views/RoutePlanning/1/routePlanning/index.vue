<template>
  <div
    v-drag
    class="route_planning_container">
    <i class="route_planning_close el-icon-close"
      @click="handleClose" />
    <div
      class="edit_container">
      <div
        class="pub_tit">
        {{ watchCurrentRoute && watchCurrentRoute.code ? '编辑' : '新建' }}
        <i v-show="watchEditAction"
          class="el-icon-arrow-left"
          @click="handleBackToAction" />
      </div>
      <div
        class="edit_waypoint">
        <div
          class="edit_waypoint_con pub_con"
          @mousedown="onButtonDown"
          @touchstart="onButtonDown">
          <div
            v-show="!watchEditAction"
            class="edit_waypoint_form">
            <div
              class="pub_tit_form">
              {{ computedWayPointName }}
              <div
                v-show="!wayPointVisible"
                class="text_btn"
                @click="handleOpenWayPointList">
                航点列表
                <div
                  v-show="wayPointList.length > 0"
                  class="badge">
                  {{ wayPointList.length }}
                </div>
              </div>
            </div>
            <div
              class="way_point_form">
              <WayPointForm
                ref="WayPointForm"
                :position-data="wapPointPositionData"
                :data="selectWayPoint"
                @add="handleAddWayPointSubmit"
                @edit="handleEditWayPointSubmit"
                @input="handleEditWayPointPosition" />
            </div>
            <div
              class="pub_button_li">
              <div
                class="pub_btn setting select"
                @click="handleOpenActionForm">
                <i
                  class="icon setting" />
                <span>动作设置</span>
              </div>
              <div
                :class="[{disabled: watchCurrentWayPointIndex === -1}, {select: watchWayPointMove}]"
                class="pub_btn move"
                @click="handleMoveWayPoint">
                <i
                  class="icon move" />
                <span>移动</span>
              </div>
              <div
                :class="[{disabled: watchCurrentWayPointIndex > -1}, {select: watchAtionBarsVisible}]"
                class="pub_btn"
                @click="handleLockMovePoint">
                <i
                  class="icon lock" />
                <span>锁定</span>
              </div>
            </div>
            <div
              class="pub_button_li">
              <div
                class="pub_btn select"
                @click="handleAddEditWayPoint">
                <i v-if="watchCurrentWayPointIndex === -1"
                  class="icon add" />
                <span>{{ watchCurrentWayPointIndex === -1 ? '添加航点' : '保存航点' }}</span>
              </div>
              <div
                class="pub_btn select"
                @click="handleLookingDown">
                <span>俯视</span>
              </div>
              <div
                class="pub_btn select"
                @click="handleGetDevicePosition">
                <i
                  class="icon site" />
                <span>位置拾取</span>
              </div>
            </div>
          </div>
          <div
            v-show="watchEditAction"
            class="edit_action_form">
            <div
              class="pub_tit_form">
              {{ computedActionName }}
              <div
                v-show="!wayPointVisible"
                class="text_btn"
                @click="handleOpenWayPointList">
                航点列表
                <div
                  v-show="wayPointList.length > 0"
                  class="badge">
                  {{ wayPointList.length }}
                </div>
              </div>
            </div>
            <div
              class="action_form_container">
              <ActionForm
                ref="ActionForm"
                :data="selectAction"
                :angle-data="actionAngleData"
                :cone-angle="coneAngleData"
                @add="handleAddActionSubmit"
                @edit="handleEditActionSubmit"
                @change="handleActionChange" />
            </div>
            <div
              class="action_list">
              <SortList
                :name="'action'"
                :list="selectWayPoint.actionEntityList"
                :select-index="watchCurrentActionIndex"
                @select="handleActionIemClick"
                @sort="handleActionSort" />
            </div>
            <div
              class="pub_button_li">
              <div
                class="pub_btn select"
                @click="handleAddEditAction">
                <i v-if="watchCurrentActionIndex === -1"
                  class="icon add" />
                <span>{{ watchCurrentActionIndex === -1 ? '新增' : '保存动作' }}</span>
              </div>
              <div
                class="pub_btn delete"
                :class="{disabled: watchCurrentActionIndex === -1}"
                @click="handleDeleteAction">
                <i
                  class="icon delete" />
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="wayPointVisible"
          class="waypoint_list pub_con"
          @mousedown="onButtonDown"
          @touchstart="onButtonDown">
          <div
            class="pub_tit_form">
            航点列表
            <div
              class="icon_btn"
              @click="handleCloseWayPointList">
              <i />
            </div>
          </div>
          <RouteFrom
            ref="RouteFrom"
            :from="selectRoute"
            :voyage="voyageTime"
            @submit="handleSaveRouteSubmit" />
          <div
            class="way_point_list"
            :class="{height: watchEditAction}">
            <SortList
              ref="WayPointSortList"
              :name="'wayPoint'"
              :list="wayPointList"
              :select-index="watchCurrentWayPointIndex"
              @select="handleWayPointIemClick"
              @sort="handleWayPointSort" />
          </div>
          <div
            class="pub_button_li">
            <div
              class="pub_btn delete"
              :class="{disabled: watchCurrentWayPointIndex === -1}"
              @click="handleDeleteWayPoint">
              <i
                class="icon delete" />
              <span>删除</span>
            </div>
            <div
              class="pub_btn select"
              :class="{disabled: watchCurrentWayPointIndex > -1}"
              @click="handleReverse">
              <i
                class="icon sort" />
              <span>倒序</span>
            </div>
            <div
              class="pub_btn select"
              @click="handleSaveRoute()">
              <i
                class="icon save" />
              <span>保存</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  setCurrentWayPointStyle,
  setCurrentActionOrientation,
  setCurrentActionStyle,
  clearMovePointEntity,
  setMovePointEntityPosition,
  setMovePointEntityVisible,
  makeMovePointEntity,
  makeRouteEntities,
  clearEntityMoveStatus,
  clearRouteEntities,
  init,
  clearCone,
  removeInputActionFun,
  actionBarsModal,
  setTrackedEntity,
  lookingDownNew,
  lookingDown
} from '@/utils/hushi/MeasurementUtils/RoutePlanning'
import { getPoint } from '@/utils/global/cesiumFunction'
import ActionForm from './components/ActionForm.vue'
import SortList from './components/SortList.vue'
import WayPointForm from './components/WayPointForm.vue'
import RouteFrom from './components/RouteFrom.vue'
import {
  // uniq,
  // isEqual,
  // includes,
  debounce,
  cloneDeep
} from 'lodash'
export default {
  name: 'RoutePlanning',

  components: {
    RouteFrom,
    ActionForm,
    SortList,
    WayPointForm
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    },
    differTime: {
      type: [String, Number],
      default: 0
    }
  },

  data () {
    return {
      voyageTime: '', // 航程预计时间
      containerVisible: false,
      selectAction: {},
      coneAngleData: {}, // 视锥获取的角度
      actionAngleData: {}, // 位置拾取角度
      wapPointPositionData: {}, // 位置拾取的坐标
      selectWayPoint: {},
      wayPointList: [],
      selectRoute: {},
      routePlanningVisible: false,
      wayPointVisible: true
    }
  },

  computed: {
    watchAtionBarsVisible () {
      const data = this.$store.state.routePlanning.ationBarsVisible
      return data
    },
    watchCurrentRoute () {
      const data = this.$store.state.routePlanning.currentRoute
      return data
    },
    watchAtionBarsPress () {
      const data = this.$store.state.routePlanning.ationBarsPress
      return data
    },
    watchEditWayPoint () {
      const data = this.$store.state.routePlanning.editWayPoint
      return data
    },
    watchConeAngle () {
      const data = this.$store.state.routePlanning.coneAngle
      return data
    },
    watchEditAction () {
      const data = this.$store.state.routePlanning.editAction
      return data
    },
    watchWayPointMove () {
      const data = this.$store.state.routePlanning.wayPointMove
      return data
    },
    movePointVisible () {
      return this.watchCurrentWayPointIndex === -1
    },
    wayPointNewPosition () {
      const data = this.$store.state.routePlanning.wayPointNewPosition
      return data
    },
    watchCurrentWayPointIndex () {
      const data = this.$store.state.routePlanning.currentWayPointIndex
      return data
    },
    watchCurrentActionIndex () {
      const data = this.$store.state.routePlanning.currentActionIndex
      return data
    },
    droneInfo () {
      const data = this.$store.state.deviceInfo.droneInfo
      return data
    },
    computedWayPointName () {
      let index = 0
      if (this.watchCurrentWayPointIndex > -1) {
        index = this.watchCurrentWayPointIndex + 1
      } else {
        index = this.wayPointList.length + 1
      }
      return '航点' + index
    },
    computedActionName () {
      // let actionIndex = 0
      let wayPointIndex = 0
      if (this.watchCurrentWayPointIndex > -1) {
        wayPointIndex = this.watchCurrentWayPointIndex + 1
      } else {
        wayPointIndex = this.wayPointList.length + 1
      }
      if (this.watchCurrentActionIndex > -1) {
        // actionIndex = this.selectActionIndex + 1
      } else {
        if (this.selectWayPoint.length > 0) {
          // actionIndex = this.selectWayPoint.actionEntityList.length + 1
        } else {
          // actionIndex = 1
        }
      }
      return '航点' + wayPointIndex + '云台设置'
    }
  },

  watch: {
    // 操作杆和锁定按钮同步
    watchAtionBarsVisible (val) {
      setTrackedEntity(val)
    },
    // 摇杆按钮按下
    watchAtionBarsPress () {
      // lockMovePointEntity(!val)
      // setTrackedEntity(val)
    },
    // 编辑航点状态
    watchEditWayPoint (val) {
      // lookingDown(val)
    },
    watchConeAngle (val) {
      this.coneAngleData = val
    },
    watchEditAction () {
      // clearCone()
      // this.$refs.ActionForm.reset()
    },
    watchWayPointMove (val) {
    },
    watchEditStatus (val) {
      this.$store.commit('routePlanning/updateEditWayPoint', val)
    },
    movePointVisible (val) {
      if (val) {
        // 显示航点拖动球
        setMovePointEntityPosition()
      }
    },
    wayPointNewPosition (val) {
      const _val = cloneDeep(val)
      _val.longitude = parseFloat(_val.longitude)
      _val.latitude = parseFloat(_val.latitude)
      _val.altitude = parseFloat(_val.altitude)
      this.$nextTick(() => {
        this.wapPointPositionData = _val
      })
      // 航点位置变化同时，修改航线
      if (this.watchCurrentWayPointIndex > -1) {
        // 选中了航点
        const _wayPointList = cloneDeep(this.wayPointList)
        const _data = _wayPointList[this.watchCurrentWayPointIndex]
        _data.longitude = _val.longitude
        _data.latitude = _val.latitude
        _data.altitude = _val.altitude
        _wayPointList.splice(this.watchCurrentWayPointIndex, 1, _data)
        this.makeRouteEntitiesDebounce(_wayPointList)
      }
    },
    watchCurrentActionIndex (val) {
      if (val > -1) {
        // 动作选中后，根据 yaw row pitch 绘制出视锥
        // makeConeByHeadingPitchRoll(this.selectAction, this.selectWayPoint)
      } else {
        clearCone()
        this.selectAction = {}
      }
      setCurrentActionStyle(this.watchCurrentWayPointIndex, val)
    },
    watchCurrentWayPointIndex (val, oldVal) {
      // 解锁移动
      this.$store.commit('routePlanning/updateWayPointMove', false)
      // 解锁航点球
      this.$store.commit('routePlanning/updateAtionBarsVisible', false)
      const _wayPointList = cloneDeep(this.wayPointList)
      if (val > -1) {
        // 选中
        this.selectWayPoint = _wayPointList[val]
        setMovePointEntityVisible('hide')
      } else {
        // 取消选中，航点球出现在最后一个航点上
        setMovePointEntityVisible('show')
        clearCone()
        this.selectWayPoint = {}
        const _data = _wayPointList[_wayPointList.length - 1]
        if (!_data) {
          return
        }
        const _position = {
          longitude: _data.longitude,
          latitude: _data.latitude,
          altitude: _data.altitude
        }
        setMovePointEntityPosition(_position)
        this.makeRouteEntitiesDebounce(_wayPointList)
      }
      setCurrentWayPointStyle(val)
    },
    visible (val) {
      this.$refs.RouteList.search = ''
      this.containerVisible = val
      if (val) {
        this.$refs.RouteList.resetFun()
      } else {
        this.close()
      }
    }
  },

  mounted () {
    // 解锁飞机
    if (this.$vueSelf.lockDevice) {
      this.$vueSelf.lockDrone(0)
    }
    lookingDown(true)
    init()
    this.resetAllData()
    this.$store.commit('routePlanning/updateEditWayPoint', true)
    makeMovePointEntity()
    if (this.watchCurrentRoute && this.watchCurrentRoute.code) {
      // 编辑
      this.selectRoute = this.watchCurrentRoute
      this.getWayPointInfo(this.watchCurrentRoute.code)
    } else {
      // 新建
      // 把航点球锁定到屏幕中心
      const center = this.$tool.getCameraCenterPosition()
      setMovePointEntityPosition(center)
      this.handleLockMovePoint() // 打开编辑界面默认锁定航点球视角
    }
  },

  beforeDestroy () {
    this.close()
  },

  methods: {
    onButtonDown (event) {
      event.stopPropagation()
    },
    handleChooseDevice (data) {
      // 选择了机构设备，解锁航点球
      this.$store.commit('routePlanning/updateAtionBarsVisible', false)
    },
    makeRouteEntitiesDebounce: debounce(function (list) {
      clearRouteEntities('routePlanning')
      const routeResult = makeRouteEntities({
        list: list, // 航点数据
        idPrefix: 'routePlanning', // 航线所有元素 ID 前缀（用于多处绘制/清除航线）
        distanceLabel: true, // 是否显示航线距离标注
        heading: true, // 是否显示机头朝向
        action: true, // 是否显示动作朝向
        altitudeLabel: true, // 是否显示海拔
        totalDistance: true // 总航程
      })
      if (routeResult && routeResult.distanceTotal) {
        this.voyageTime = `${routeResult.distanceTotal}m/${routeResult.planeTime}min`
      }
    }),
    // 操作杆模式
    handleChangeZ (value) {
      actionBarsModal('z', value)
    },
    handleChangeXY (value) {
      actionBarsModal('xy', value)
    },
    resetAllData () {
      clearMovePointEntity()
      clearRouteEntities('routePlanning')
      this.voyageTime = ''
      this.selectWayPoint = {}
      this.wayPointList = []
      this.selectRoute = {}
      this.$refs.RouteFrom.reset()
      this.$store.commit('routePlanning/updateEditAction', false)
      this.$store.commit('routePlanning/updateWayPointIndex', -1)
      this.$store.commit('routePlanning/updateCurrentActionIndex', -1)
    },
    handleBackToAction () {
      this.$store.commit('routePlanning/updateEditAction', false)
      // if (this.selectActionIndex > -1) {
      //   this.$confirm('当前航点有未保存的动作，是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).then(() => {
      //     this.editAction = false
      //   }).catch(() => { })
      // } else {
      //   this.editAction = false
      // }
    },
    // 执行航线
    handleFlyRoute () {
      this.$emit('flyRoute', this.selectRoute.code)
    },
    // 保存航线
    handleSaveRouteFun (data) {
      if (this.wayPointList.length < 1) {
        this.$message.error('请先添加航点！')
        return
      }
      const _wayPointList = cloneDeep(this.wayPointList)
      const result = []
      // let _routeType = this.$vueSelf.$refs.menu.$refs.electricRule.level === 1 ? 4 : 5
      const _routeType = data.routeType
      let _routeId = 0
      let message = '航线保存成功！'
      _wayPointList.map((item, index) => {
        item.direction = item.heading
        if (item.actionEntityList && item.actionEntityList.length > 0) {
          item.actionEntityList.map((action, actionIndex) => {
            action.actionIndex = actionIndex + 1
            action.name = action.actionName
            action.action = action.camAction
            action.pre_time = action.preTime * 1000
            action.target_type = action.targetType
            delete action.preTime
            delete action.targetType
          })
        }
        if (this.selectRoute.routeId) {
          // 编辑
          // _routeType = item.waypointType
          _routeId = this.selectRoute.routeId || item.routeId
          message = '航线编辑成功！'
        }
        if (item.longitude && item.longitude !== '' && item.longitude !== 0) {
          result.push({
            index: index + 1,
            routeType: _routeType,
            routeId: _routeId,
            speed: item.speed,
            longitude: Number(item.longitude) + 180,
            latitude: Number(item.latitude) + 90,
            altitude: Number(item.altitude),
            routeName: this.$encrypt.encryptFunction(data.name),
            wayPointName: item.waypointName,
            action: item.actionEntityList,
            direction: item.direction
          })
        }
      })
      console.log('............result', result, _routeId, message)
      // return
      if (result.length > 0) {
        const reqData = {
          routAndWayPointAction: result
        }
        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$confirm('航线保存中，请稍候', '提示', {
            closeOnClickModal: false,
            showClose: false,
            showConfirmButton: false,
            showCancelButton: false
          })
          return this.$http({
            url: this.$http.addUrl('/api/v1/open/route/save_update'),
            method: 'post',
            data: this.$http.adornData(reqData)
          }).then(({ data }) => {
            if (data.flag === 0) {
              this.close()
              // this.$message.success(message)
              this.$message.success({
                customClass: 'message_new_style',
                message: message
              });
              this.$msgbox.close()
            }
          }).catch(err => {
            console.log(err)
            this.$message.success({
              customClass: 'message_new_style',
              message: '航线保存失败！'
            })
            this.$msgbox.close()
          })
        })
      }
    },
    // 保存航线
    handleSaveRouteSubmit (data) {
      this.handleSaveRouteFun(data)
      // 添加未保存的提示逻辑...
      // if (this.watchCurrentWayPointIndex > -1) {
      //   this.$confirm('有航点未保存，是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).then(() => {
      //     this.handleSaveRouteFun(formName)
      //   }).catch(() => { })
      // } else {
      //   this.handleSaveRouteFun(formName)
      // }
    },
    handleSaveRoute () {
      this.$refs.RouteFrom.submit('save')
    },
    // 保存动作成功后，自动将动作数据存储到航点中
    handleEditActionSuccess () {
      this.$refs.ActionForm.reset()
      this.$store.commit('routePlanning/updateCurrentActionIndex', -1)
      if (this.watchCurrentWayPointIndex === -1) {
        return
      }
      const _data = cloneDeep(this.selectWayPoint)
      if (this.wayPointList.length <= 0) {
        return
      }
      this.wayPointList.splice(this.watchCurrentWayPointIndex, 1, _data)
      // 清除视锥
      clearCone()
    },
    // 编辑动作
    // 偏航角改变
    handleActionChange: debounce(function (data) {
      // 兼容 heading === -2 的情况
      setCurrentActionOrientation(
        this.watchCurrentWayPointIndex,
        this.watchCurrentActionIndex,
        this.selectWayPoint,
        data,
        this.wayPointList[this.watchCurrentWayPointIndex + 1] // 下一个航点（计算机头朝向）
      )
    }, 400),
    handleAddActionSubmit (data) {
      const _data = {
        actionName: this.$encrypt.encryptFunction(data.actionName),
        pitch: data.pitch,
        yaw: data.yaw,
        zoom: data.zoom,
        camAction: data.camAction,
        targetType: data.targetType,
        preTime: data.preTime
      }
      this.selectWayPoint.actionEntityList.push(_data)
      this.handleEditActionSuccess()
    },
    handleEditActionSubmit (data) {
      const _data = {
        actionName: this.$encrypt.encryptFunction(data.actionName),
        pitch: data.pitch,
        yaw: data.yaw,
        zoom: data.zoom,
        camAction: data.camAction,
        targetType: data.targetType,
        preTime: data.preTime
      }
      this.selectWayPoint.actionEntityList.splice(this.watchCurrentActionIndex, 1, _data)
      this.handleEditActionSuccess()
    },
    // 删除动作
    handleDeleteAction () {
      this.$confirm('确认删除动作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.selectWayPoint.actionEntityList.splice(this.watchCurrentActionIndex, 1)
        this.handleEditActionSuccess()
      }).catch(() => { })
    },
    handleAddEditAction () {
      if (this.watchCurrentActionIndex > -1) {
        // 编辑动作
        this.$refs.ActionForm.submit('edit')
      } else {
        // 添加动作
        this.$refs.ActionForm.submit('add')
      }
    },
    // 编辑完航点，重置航点表单，重新绘制航线航点
    handleWayPointFinish () {
      const _wayPointList = cloneDeep(this.wayPointList)
      this.$refs.WayPointForm.reset()
      this.$store.commit('routePlanning/updateWayPointIndex', -1)
      this.$store.commit('routePlanning/updateWayPointMove', false)
      this.selectWayPoint.actionEntityList = []
      this.makeRouteEntitiesDebounce(_wayPointList)
      setMovePointEntityPosition()
    },
    // 删除航点
    handleDeleteWayPoint () {
      this.$confirm(`确认删除航点${this.watchCurrentWayPointIndex + 1}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.wayPointList.splice(this.watchCurrentWayPointIndex, 1)
        this.handleWayPointFinish()
      }).catch(() => { })
    },
    // 输入框里编辑了航点的坐标，重绘航点实体
    handleEditWayPointPosition (data) {
      setMovePointEntityVisible('hide')
      const _data = cloneDeep(data)
      const _position = {
        longitude: _data.longitude,
        latitude: _data.latitude,
        altitude: _data.altitude
      }
      if (_position.longitude === '' || _position.latitude === '' || _position.altitude === '') {
        return
      }
      setMovePointEntityVisible('show')
      setMovePointEntityPosition(_position)
    },
    // 编辑航点
    handleEditWayPointSubmit (data, actionEntityList) {
      const _data = {
        routeId: data.routeId,
        waypointType: data.routeType,
        actionEntityList: actionEntityList,
        waypointName: this.$encrypt.encryptFunction(data.waypointName),
        longitude: data.longitude,
        latitude: data.latitude,
        altitude: data.altitude,
        heading: data.heading,
        speed: data.speed,
        time: data.time
      }
      this.wayPointList.splice(this.watchCurrentWayPointIndex, 1, _data)
      this.handleWayPointFinish()
    },
    // 添加航点
    handleAddWayPointSubmit (data, actionEntityList) {
      // return
      const _data = {
        routeId: data.routeId,
        waypointType: data.routeType,
        actionEntityList: actionEntityList,
        waypointName: this.$encrypt.encryptFunction(data.waypointName),
        longitude: data.longitude,
        latitude: data.latitude,
        altitude: data.altitude,
        heading: data.heading,
        speed: data.speed,
        time: data.time
      }
      this.wayPointList.push(_data)
      this.handleWayPointFinish()
    },
    // 自动保存航点数据
    autoSaveWayPoint () {
      this.$refs.WayPointForm.submit('edit', this.selectWayPoint.actionEntityList)
    },
    handleAddEditWayPointFun () {
      setMovePointEntityVisible('hide')
      if (this.watchCurrentWayPointIndex > -1) {
        // 编辑航点
        this.$refs.WayPointForm.submit('edit', this.selectWayPoint.actionEntityList)
      } else {
        // 添加航点
        this.$refs.WayPointForm.submit('add', this.selectWayPoint.actionEntityList)
      }
      if (this.watchCurrentWayPointIndex === -1) {
        // 编辑完上一个航点，开始添加新航点，设置航点球的位置为上一个航点的坐标
        const _data = this.wayPointList[this.wayPointList.length - 1]
        let position = null
        if (_data) {
          position = {
            longitude: _data.longitude,
            latitude: _data.latitude,
            altitude: _data.altitude
          }
        } else {
          position = this.$tool.getCameraCenterPosition()
        }
        setMovePointEntityVisible('show')
        setMovePointEntityPosition(position)
      }
    },
    handleAddEditWayPoint () {
      this.handleAddEditWayPointFun()
      // if (this.selectActionIndex > -1) {
      //   this.$confirm('当前航点有未保存的动作，是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).then(() => {
      //     this.handleAddEditWayPointFun()
      //   }).catch(() => { })
      // } else {
      //   this.handleAddEditWayPointFun()
      // }
    },
    // 动作排序
    handleActionSort (list) {
      this.selectWayPoint.actionEntityList = list
    },
    // 选中动作
    handleActionIemClick (item, index) {
      // this.selectActionIndex =
      //   this.selectActionIndex === index
      //     ? (this.selectActionIndex = -1)
      //     : (this.selectActionIndex = index)
      this.watchCurrentActionIndex === index
        ? (this.$store.commit('routePlanning/updateCurrentActionIndex', -1))
        : (this.$store.commit('routePlanning/updateCurrentActionIndex', index))
      this.selectAction = this.watchCurrentActionIndex === -1 ? {} : item
    },
    // 锁定航点球
    handleLockMovePoint () {
      // 判断是否已锁定飞机视角 lockDevice
      this.watchAtionBarsVisible
        ? this.$store.commit('routePlanning/updateAtionBarsVisible', false)
        : this.$store.commit('routePlanning/updateAtionBarsVisible', true)
    },
    // 移动航点
    handleMoveWayPoint () {
      this.watchWayPointMove
        ? this.$store.commit('routePlanning/updateWayPointMove', false)
        : this.$store.commit('routePlanning/updateWayPointMove', true)
      if (this.watchWayPointMove) {
        let center = null
        if (this.watchCurrentWayPointIndex > -1) {
          const _selectWayPoint = cloneDeep(this.selectWayPoint)
          // 航点球设置在当前选中航点的位置处
          center = {
            longitude: _selectWayPoint.longitude,
            latitude: _selectWayPoint.latitude,
            altitude: _selectWayPoint.altitude
          }
        } else {
          center = this.$tool.getCameraCenterPosition()
        }
        setMovePointEntityVisible('show')
        setMovePointEntityPosition(center)
      } else {
        clearEntityMoveStatus()
        setMovePointEntityVisible('hide')
      }
    },
    // 航点排序
    handleWayPointSort (list) {
      const _wayPointList = cloneDeep(list)
      this.makeRouteEntitiesDebounce(_wayPointList)
      this.wayPointList = list
    },
    // 倒序
    handleReverse () {
      const _wayPointList = cloneDeep(this.wayPointList).reverse()
      this.wayPointList = _wayPointList
    },
    // 选中航点
    handleWayPointIemClick (item, index) {
      // 如果当前有未保存的航点，在切换航点之前先保存一次航点信息（自动触发保存航点数据）
      // const flag = isEqual(this.$wayPointList[this.watchCurrentWayPointIndex], this.wayPointList[this.watchCurrentWayPointIndex])
      // if (this.selectWayPointIndex > -1) {
      //   this.$confirm('当前有未保存的航点，是否保存？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).then(() => {
      //     this.autoSaveWayPoint()
      //   }).catch(() => { })
      // }
      this.$store.commit('routePlanning/updateWayPointMove', false)
      clearEntityMoveStatus()
      setMovePointEntityVisible('hide')
      // 重置航点数据
      // this.selectActionIndex = -1
      this.$store.commit('routePlanning/updateCurrentActionIndex', -1)
      // this.selectWayPointIndex =
      //   this.selectWayPointIndex === index
      //     ? (this.selectWayPointIndex = -1)
      //     : (this.selectWayPointIndex = index)
      // // 将当前选中的航点索引存储到 vuex 中，实体的点击和航点列表的点击同步处理
      // this.$store.commit('routePlanning/updateWayPointIndex', this.selectWayPointIndex)
      this.watchCurrentWayPointIndex === index
        ? (this.$store.commit('routePlanning/updateWayPointIndex', -1))
        : (this.$store.commit('routePlanning/updateWayPointIndex', index))
    },
    handleCloseWayPointList () {
      this.wayPointVisible = false
    },
    handleOpenWayPointList () {
      this.wayPointVisible = true
    },
    handleOpenWayPointForm () {
      this.$store.commit('routePlanning/updateEditAction', false)
    },
    handleOpenActionForm () {
      if (!this.selectWayPoint.actionEntityList) {
        this.selectWayPoint.actionEntityList = []
      }
      this.$store.commit('routePlanning/updateEditAction', true)
    },
    // 切换为俯视
    handleLookingDown () {
      lookingDownNew(this.selectWayPoint.longitude, this.selectWayPoint.latitude, 200)
    },
    // 位置拾取
    handleGetDevicePosition () {
      console.log('............位置拾取', this.droneInfo)
      if (this.droneInfo.position && this.droneInfo.position.longitude && this.droneInfo.position.longitude !== '--') {
        // 点击位置拾取，解锁航点球
        this.$store.commit('routePlanning/updateWayPointMove', false)
        this.$store.commit('routePlanning/updateAtionBarsVisible', false)
        const _data = this.droneInfo.position
        const position = {
          longitude: _data.longitude,
          latitude: _data.latitude,
          altitude: _data.height
        }
        const _AngleData = {
          roll: this.droneInfo.podStatus[1] || 0,
          yaw: this.droneInfo.podStatus[2] || 0,
          pitch: this.droneInfo.podStatus[3] || 0,
          zoom: this.droneInfo.podStatus[4] || 0
        }
        this.actionAngleData = _AngleData
        this.wapPointPositionData = position
        setMovePointEntityVisible('show')
        setMovePointEntityPosition(position)
      } else {
        this.$message.error('请选择设备！')
      }
    },
    // 选择了摇臂模式
    chooseRadialPattern () {
      this.$emit('chooseRadialPatternModel')
    },
    // 新建航线（选择了标准模式）
    handleAddRoute () {
      this.resetAllData()
      const center = this.$tool.getCameraCenterPosition()
      setMovePointEntityPosition(center)
      this.$emit('chooseModelSuccess')
    },
    handleOpenEditCon (type) {
      init()
      if (type === 'add') {
        // 点击新建，打开航线模式窗口，选择标准模式还是摇臂模式
        this.$emit('chooseModel')
      } else {
        // this.getWayPointInfo()
      }
    },
    getWayPointInfo () {
      if (this.selectRoute.code) {
        getPoint(this.selectRoute.code).then(res => {
          if (res && res.length > 0) {
            res.map(point => {
              point.longitude = parseFloat(point.longitude).toFixed(7)
              point.latitude = parseFloat(point.latitude).toFixed(7)
              if (point.actionEntityList && point.actionEntityList.length > 0) {
                point.actionEntityList.map(action => {
                  // 悬停时间转为毫秒
                  action.preTime = action.preTime / 1000
                })
              }
            })
            this.wayPointList = res
            this.$store.commit('routePlanning/updateWayPointMove', false)
            const _last = res[res.length - 1]
            // 拿到航点数据后，把航点球的位置设置到最后一个航点上
            setMovePointEntityPosition(_last)
            this.handleLockMovePoint() // 锁定航点球视角
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleClose () {
      this.$confirm('航线数据未保存，是否继续？', '提示', {
        showClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.close()
      }).catch(() => { })
    },
    close () {
      this.resetAllData()
      this.wayPointList = []
      this.routePlanningVisible = false
      removeInputActionFun()
      clearEntityMoveStatus()
      lookingDown(false)
      setTrackedEntity(false)
      this.$store.commit('routePlanning/updateAtionBarsVisible', false)
      this.$store.commit('routePlanning/updateEditWayPoint', false)
      this.$store.commit('routePlanning/updateWayPointIndex', -1)
      this.$store.commit('routePlanning/updateConeAngle', {})
      this.$store.commit('routePlanning/updateCurrentRoute', {})
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/hushi/RoutePlanning.scss';
</style>