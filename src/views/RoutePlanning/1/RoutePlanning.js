// 航线规划

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import tool from '@/utils/tool'
import store from '@/store'
import MeasurementUtils from './common'
import { _getIntersectObj } from "@/utils/hushi/autoWaypoint.js"
import * as turf from '@turf/turf'
import {
  debounce,
  includes,
  isEqual,
  findIndex,
  uniq,
  cloneDeep
} from 'lodash'

let entitiesIds = []

// 调试
// const _array = new Array(30).fill('')
// _array.map((a, i) => {
//   entitiesIds.push('routePlanningWayPoint' + i) // 航点
//   entitiesIds.push('routeListHeadingLine' + i) // 航点
//   entitiesIds.push('routeListAltitudeLabel' + i) // 航点
//   entitiesIds.push('routeListPlanningRoute' + i) // 航线
//   entitiesIds.push('testPoint' + i)
// })

// let actionBarsEntity = null // 操作杆模式下的实体（当地图拖动后，屏幕坐标会发生变化，重新获取实体的位置）
let newPrimitive = null // 椎体图元
let overlookStatus = false // 俯视状态
let routePlanningHandler = null
let leftDownFlag = false // 鼠标左键是否按下
let pickedEntity = null // 被选中的 Entity
let pickedEntityHeight = 0 // 被选中的 Entity 高度
let currentPosition = null // 被点击实体当前的位置
let currentWayPointIndex = -1 // 当前选中的航点
let centerPosition = null // 中心点
let startPoint = null
let startHeight = 0
let cameraZ = 0 // 相机高度

function pushEntityId (id) {
  entitiesIds.push(id)
}

/**
 * @description: 改变当前选中的航点实体的样式
 * @param {Number} watchCurrentWayPointIndex // 选中的航点索引
 * @return {*}
 */
export function setCurrentWayPointStyle (watchCurrentWayPointIndex) {
  const _entitiesIds = uniq(entitiesIds).filter(_ =>
    _.indexOf('routePlanningWayPoint') > -1
  )
  _entitiesIds.map(id => {
    if (viewer.entities.getById(id)) {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.billboard.scale = 1
        _entity.billboard.image = require('@/assets/images/controls/routePlanning/point.png')
      }
    }
  })
  if (watchCurrentWayPointIndex > -1) {
    const _id = 'routePlanningWayPoint' + watchCurrentWayPointIndex
    if (viewer.entities.getById(_id)) {
      const _entity = viewer.entities.getById(_id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.billboard.scale = 1.2
        _entity.billboard.image = require('@/assets/images/controls/routePlanning/point1.png')
      }
    }
  }
}

/**
 * @description: 改变当前选中的动作角度实体的方向
 * @param {Number} watchCurrentWayPointIndex // 选中的航点索引
 * @param {Number} watchCurrentActionIndex // 选中的动作索引
 * @param {Object} selectWayPoint // 选中的航点
 * @param {Object} actionChangeData // 改变后的动作值
 * @param {Object} nextWayPoint // 下一个航点（计算机头朝向）
 * @return {*}
 */
export function setCurrentActionOrientation (watchCurrentWayPointIndex, watchCurrentActionIndex, selectWayPoint, actionChangeData, nextWayPoint) {
  if (watchCurrentActionIndex > -1) {
    let _heading = selectWayPoint.heading
    if (selectWayPoint.heading === -2) {
      // 机头朝向为下一个点
      if (nextWayPoint) {
        _heading = getHeadingDegByTwoPoints(selectWayPoint, nextWayPoint)
      }
    }
    const _id = 'routePlanningActionCylinder' + watchCurrentWayPointIndex + '' + watchCurrentActionIndex
    if (viewer.entities.getById(_id)) {
      const _entity = viewer.entities.getById(_id)
      if (_entity && _entity instanceof Cesium.Entity) {
        const length = 40
        const _yaw = Number(Number(_heading) + Number(actionChangeData.yaw))
        const _pitch = actionChangeData.pitch
        let position = new Cesium.Cartesian3.fromDegrees(selectWayPoint.longitude, selectWayPoint.latitude, selectWayPoint.altitude)
        const dir = MeasurementUtils.getVector(selectWayPoint, _yaw)
        const forward_l = length * Math.cos(_pitch * Math.PI / 180)
        position = MeasurementUtils.translateByDirection(position, dir, forward_l)
        const y_offset = length * Math.sin(_pitch * Math.PI / 180)
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        const lon = Cesium.Math.toDegrees(cartographic.longitude)
        position = new Cesium.Cartesian3.fromDegrees(lon, lat, selectWayPoint.altitude - y_offset)
        _entity.position = new Cesium.CallbackProperty(function () {
          return position
        }, false)
        _entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
          position,
          new Cesium.HeadingPitchRoll.fromDegrees(_yaw, 0, -1 * _pitch)
        )
      }
    }
  }
}

/**
 * @description: 改变当前选中的动作角度实体的样式
 * @param {Number} watchCurrentWayPointIndex // 选中的航点索引
 * @param {Number} watchCurrentActionIndex // 选中的动作索引
 * @return {*}
 */
export function setCurrentActionStyle (watchCurrentWayPointIndex, watchCurrentActionIndex) {
  const _entitiesIds = uniq(entitiesIds).filter(_ =>
    _.indexOf('routePlanningActionCylinder') > -1
  )
  _entitiesIds.map(id => {
    if (viewer.entities.getById(id)) {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.box.material = new Cesium.PolylineArrowMaterialProperty(
          new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
        )
      }
    }
  })
  if (watchCurrentActionIndex > -1) {
    const _id = 'routePlanningActionCylinder' + watchCurrentWayPointIndex + '' + watchCurrentActionIndex
    if (viewer.entities.getById(_id)) {
      const _entity = viewer.entities.getById(_id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.box.material = new Cesium.PolylineArrowMaterialProperty(
          new Cesium.Color.fromCssColorString('#fcb718').withAlpha(1)
        )
      }
    }
  }
}

/**
 * @description: 切换为俯视
 * @param {Boolean} status
 * @return {*}
 */
export function lookingDownNew (longitude, latitude, altitude) {
  let _position = {}
  if (longitude && latitude) {
    _position = {
      longitude: longitude,
      latitude: latitude
    }
  } else {
    const _entity = viewer.entities.getById('movePoint')
    if (_entity && _entity instanceof Cesium.Entity) {
      const movePointEntity = viewer.entities.getById('movePoint')
      const position = MeasurementUtils.cartesianToLongAndLat(movePointEntity.position.getValue())
      _position = {
        longitude: position.longitude,
        latitude: position.latitude
      }
    } else {
      const center = this.$tool.getCameraCenterPosition()
      _position = {
        longitude: center.longitude,
        latitude: center.latitude
      }
    }
  }
  if (viewer.trackedEntity) {
    // 锁定视角状态
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(_position.longitude, _position.latitude, altitude || 200),
      orientation: {
        heading: Cesium.Math.toRadians(90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0
      }
    })
  } else {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(_position.longitude, _position.latitude, altitude || 200),
      orientation: {
        heading: Cesium.Math.toRadians(90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0
      }
    })
  }
}

/**
 * @description: 切换为俯视
 * @param {Boolean} status
 * @return {*}
 */
export function lookingDown (status) {
  const DOM = document.querySelector('.compass-gyro-background')
  if (!DOM) {
    return
  }
  if (status) {
    DOM.style.cursor = 'pointer'
    DOM.onclick = (event) => {
      event.stopPropagation()
      if (viewer.entities.getById('movePoint')) {
        const movePointEntity = viewer.entities.getById('movePoint')
        const _position = MeasurementUtils.cartesianToLongAndLat(movePointEntity.position.getValue())
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(_position.longitude, _position.latitude, 200),
          orientation: {
            heading: Cesium.Math.toRadians(90.0),
            pitch: Cesium.Math.toRadians(-90.0),
            roll: 0
          }
        })
      }
    }
  } else {
    DOM.style.cursor = 'default'
    DOM.onclick = null
  }
}

/**
 * @description: 设置追踪实体
 * @param {Boolean} status
 * @return {*}
 */
export function setTrackedEntity (status) {
  viewer.trackedEntity = null
  if (status) {
    const _entity = viewer.entities.getById('movePoint')
    if (_entity && _entity instanceof Cesium.Entity) {
      viewer.trackedEntity = _entity
    }
    // viewer.scene.camera.lookAtTransform(new Cesium.Matrix4(), new Cesium.Cartesian3(-20, 0, 10));
  }
}

/**
 * @description: 检测实体是否碰到模型
 * @param {*} start
 * @param {*} end
 * @return {*}
 */
function modelDetection (start, end) {
  return false
  const excludeArr = viewer.entities.values.filter(item =>
    item.name === '航点' ||
    item.name === '机头朝向' ||
    item.name === '海拔' ||
    item.name === '航线' ||
    item.name === '距离' ||
    item.name === 'flyToRoute' ||
    item.name === 'movePoint' ||
    item.name === 'waypoint' ||
    item.name === 'tower' ||
    item.name === '虎鲸'
  )
  const result = _getIntersectObj(start, end, excludeArr)
  const entity = viewer.entities.getById('movePoint')
  if (result && result.length > 0) {
    entity.billboard.color = new Cesium.Color.fromCssColorString('#ff0000')
    return true
  } else {
    entity.billboard.color = new Cesium.Color.fromCssColorString('#fff')
    return false
  }
}

/**
 * @description: 移除鼠标事件
 * @return {*}
 */
export function removeInputActionFun () {
  if (routePlanningHandler) {
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}

/**
 * @description: 通过航点列表计算航程
 * @param {*} list
 * @param {*} distanceTotal
 * @param {*} deviceAltitude
 * @return {*}
 */
function computedVoyageByWayPoint (list, distanceTotal, deviceAltitude) {
  const _deviceAltitude = deviceAltitude || store.state.deviceInfo.dockInfo.altitude
  let time = 0
  let point_cnt = 0
  list.map((point, index) => {
    const cur_point = [
      Number(point['longitude']) * 1.0,
      Number(point['latitude']) * 1.0,
      Number(point['altitude']) * 1.0
    ]
    if (point_cnt > 0) {
      if (point.actionEntityList && point.actionEntityList.length > 0) {
        point.actionEntityList.map(item => {
          if (Number(item.camAction) !== 1 && Number(item.camAction) !== 2) {
            time += 5
          } else {
            time += 30
          }
        })
      } else if (point.action && point.action.length > 0) {
        point.action.map(item => {
          if (Number(item.action) !== 1 && Number(item.action) !== 2) {
            time += 5
          } else {
            time += 30
          }
        })
      }
    }
    if (index === list.length - 1 && index !== 0) {
      time += distanceTotal / 7
      time += (cur_point[2] - _deviceAltitude) * 2 / 7
      time += time * 0.1
    }
    point_cnt++
  })
  return (time / 60).toFixed(2)
}

/**
 * @description: 清除视锥
 * @return {*}
 */
export function clearCone () {
  if (newPrimitive) {
    newPrimitive.destroy()
  }
  const arr = ['testPoint0', 'testPoint1', 'testPoint2']
  arr.map((id) => {
    viewer.entities.getById(id) ? viewer.entities.remove(viewer.entities.getById(id)) : void (0)
  })
}

// 测试
function makeEntityTest (list) {
  list.map((point, index) => {
    viewer.entities.getById('testPoint' + index) ? viewer.entities.remove(viewer.entities.getById('testPoint' + index)) : void (0)
  })
  list.map((point, index) => {
    const entity = viewer.entities.add(new Cesium.Entity({
      id: 'testPoint' + index,
      name: '测试点',
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height),
      data: {
        index
      },
      point: new Cesium.PointGraphics({
        show: true,
        pixelSize: 4,
        heightReference: Cesium.HeightReference.NONE,
        color: new Cesium.Color.fromCssColorString('#fcb718').withAlpha(0.4),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
        translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1)
      })
    }))
    entitiesIds.push('testPoint' + index)
  })
}

/**
 * @description: 计算俯仰角
 * @param {*} fromPosition
 * @param {*} toPosition
 * @return {*}
 */
function getPitch2 (fromPosition, toPosition) {
  const height1 = fromPosition.height
  const height2 = toPosition.height
  // 对边
  const _height = Math.abs(height1 - height2)
  // 斜边
  const _distance = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(fromPosition.longitude, fromPosition.latitude, fromPosition.height), Cesium.Cartesian3.fromDegrees(toPosition.longitude, toPosition.latitude, toPosition.height))
  // const angle = _height / _distance
  const angle = Math.sin((_height / _distance))
  let theta = angle * (180 / Math.PI)
  if (theta < 0) {
    theta = theta + 360
  }
  if ((height1 - height2) < 0) {
    return (-theta).toFixed(0)
  } else {
    return (theta).toFixed(0)
  }
}

/**
 * @description: 计算俯仰角
 * @param {*} fromPosition
 * @param {*} toPosition
 * @return {*}
 */
function getPitch (fromPosition, toPosition) {
  let finalPosition = new Cesium.Cartesian3()
  let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition)
  Cesium.Matrix4.inverse(matrix4, matrix4)
  Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition)
  Cesium.Cartesian3.normalize(finalPosition, finalPosition)
  return Cesium.Math.toDegrees(Math.asin(finalPosition.z))
}

/**
 * @description: 计算偏航角
 * @param {*} fromPosition
 * @param {*} toPosition
 * @return {*}
 */
function getHeading (fromPosition, toPosition) {
  let finalPosition = new Cesium.Cartesian3()
  let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition)
  Cesium.Matrix4.inverse(matrix4, matrix4)
  Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition)
  Cesium.Cartesian3.normalize(finalPosition, finalPosition)
  return Cesium.Math.toDegrees(Math.atan2(finalPosition.x, finalPosition.y))
}

/**
 * @description: 根据 yaw row pitch 绘制出视锥
 * @param {*} action
 * @param {*} point
 * @return {*}
 */
export function makeConeByHeadingPitchRoll (action, point) {
  // console.log('..............makeConeByHeadingPitchRoll', action, point)
  // const _position = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
  // const _hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(action.yaw + 90), Cesium.Math.toRadians(action.pitch + 90), Cesium.Math.toRadians(
  //   0))
  // const ray = new Cesium.Ray(_position, _hpr) // 无限延长的射线
  // console.log('............ray', ray)
  // const _point = {
  //   longitude: MeasurementUtils.cartesianToLongAndLat(ray.origin).longitude,
  //   latitude: MeasurementUtils.cartesianToLongAndLat(ray.origin).latitude,
  //   height: MeasurementUtils.cartesianToLongAndLat(ray.origin).altitude,
  // }
  // makeEntityTest([_point])
  // const result = viewer.scene.pickFromRay(ray, viewer.entities.values.filter(item => item.name == 'waypoint' || item.name == "虎鲸"))
  // console.log('.........result', result)
  // const _orientation = Cesium.Transforms.headingPitchRollQuaternion(_position, _hpr)
  // console.log('..........._orientation', _orientation)
  // console.log('..........._position', _position)
  // console.log('..........._hpr', _hpr)
  // const _orientation2 = new Cesium.Quaternion(0.4069224361811377, -0.08844421647431165, 0.18354590275502483, 0.890450814524023)
  // 根据 orientation 和目标点绘制视锥？

  // 视锥轮廓线图形
  // const spotLightCamera = new Cesium.Camera(viewer.scene)
  // const instanceOutline = new Cesium.GeometryInstance({
  //   geometry: new Cesium.FrustumOutlineGeometry({
  //     frustum: spotLightCamera.frustum,
  //     origin: _position,
  //     orientation: _orientation
  //   }),
  //   id: 'coneEntity',
  //   attributes: {
  //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW),
  //     show: new Cesium.ShowGeometryInstanceAttribute(true)
  //   }
  // })
  // // 添加图元
  // newPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
  //   geometryInstances: instanceOutline,
  //   eleaseGeometryInstances: false,
  //   appearance: new Cesium.PerInstanceColorAppearance({
  //     flat: true
  //   })
  // }))
}

/**
 * @description: 绘制视锥
 * @param {*} startPosition
 * @param {*} endPosition
 * @return {*}
 */
function makeCone (startPosition, endPosition) {
  if (newPrimitive) {
    newPrimitive.destroy()
  }
  const spotLightCamera = new Cesium.Camera(viewer.scene)
  const direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPosition,
    startPosition, new Cesium.Cartesian3()), new Cesium.Cartesian3())
  spotLightCamera.position = startPosition // firstPos 是相机起点
  spotLightCamera.direction = direction // direction 是相机面向的方向
  spotLightCamera.up = Cesium.Cartesian3.clone(viewer.camera.up)
  spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE
  spotLightCamera.frustum.near = 0.1
  spotLightCamera.frustum.far = Cesium.Cartesian3.distance(startPosition, endPosition)
  const scratchRight = new Cesium.Cartesian3()
  const scratchRotation = new Cesium.Matrix3()
  const scratchOrientation = new Cesium.Quaternion()
  const position = spotLightCamera.positionWC
  const directionWC = spotLightCamera.directionWC
  const up = spotLightCamera.upWC
  let right = spotLightCamera.rightWC
  right = Cesium.Cartesian3.negate(right, scratchRight)

  const rotation = scratchRotation
  Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
  Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
  Cesium.Matrix3.setColumn(rotation, 2, directionWC, rotation)
  // 计算视锥姿态
  const orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation)
  // 视锥轮廓线图形
  const instanceOutline = new Cesium.GeometryInstance({
    geometry: new Cesium.FrustumOutlineGeometry({
      frustum: spotLightCamera.frustum,
      origin: startPosition,
      orientation: orientation
    }),
    id: 'coneEntity',
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW),
      show: new Cesium.ShowGeometryInstanceAttribute(true)
    }
  })
  // 添加图元
  newPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: instanceOutline,
    eleaseGeometryInstances: false,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true
    })
  }))
}

/**
 * @description: 加载鼠标事件，实体拖动功能
 * @return {*}
 */
export function init () {
  removeInputActionFun()

  centerPosition = tool.getCameraCenterPosition()

  routePlanningHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  routePlanningHandler.setInputAction(function (event) {
    leftClickAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  routePlanningHandler.setInputAction(function (event) {
    leftDoubleClickAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  routePlanningHandler.setInputAction(function (event) {
    leftDownAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  routePlanningHandler.setInputAction(function (event) {
    leftUpAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
  routePlanningHandler.setInputAction(function (movement) {
    mouseMoveAction(movement)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  viewer.camera.percentageChanged = 0.00001
  viewer.camera.changed.addEventListener(function (event) {
    cameraZ = viewer.camera.position.z
    centerPosition = tool.getCameraCenterPosition()
    // 根据角度设置航点球图片
    if (viewer.entities.getById('movePoint')) {
      const movePoint = viewer.entities.getById('movePoint')
      const roll = viewer.camera.roll * (180 / Math.PI)
      if (roll === 0) {
        overlookStatus = true
        movePoint.billboard.image.setValue(require('@/assets/images/controls/routePlanning/xy.png'))
      } else {
        overlookStatus = false
        movePoint.billboard.image.setValue(require('@/assets/images/controls/routePlanning/z.png'))
      }
    }

    // if (!viewer.entities.getById('movePoint')) {
    //   return
    // }
    // actionBarsEntity = viewer.entities.getById('movePoint')
    // console.log('............getCameraHeight', getCameraHeight())
    // console.log('............getCameraPosition', getCameraPosition())
    // console.log('............getCameraCenterPosition', tool.getCameraCenterPosition())
    // console.log('..............position', viewer.camera.position)
    // console.log('..............heading', viewer.camera.heading * (180 / Math.PI))
    // console.log('..............pitch', viewer.camera.pitch * (180 / Math.PI))
    // console.log('..............roll', viewer.camera.roll * (180 / Math.PI))
  })
}

// 左键点击
function leftClickAction (e) {
  // 选中航点效果
  const picked = viewer.scene.pick(e.position)
  if (!picked.id) {
    return
  }
  const editWayPoint = store.state.routePlanning.editWayPoint
  if (!editWayPoint) {
    // 非编辑状态
    return
  }
  if (picked.id.data && picked.id.data.index > -1) {
    // 点击到了航点实体（航点实体反选航点）
    store.commit('routePlanning/updateCurrentActionIndex', -1) // 重置选中的动作
    const wayPointIndex = picked.id.data.index
    const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex
    _currentWayPointIndex === wayPointIndex
      ? (store.commit('routePlanning/updateWayPointIndex', -1))
      : (store.commit('routePlanning/updateWayPointIndex', wayPointIndex))
  }
}

// 左键双击
function leftDoubleClickAction (e) {
  const _editAction = store.state.routePlanning.editAction // 编辑动作状态
  if (!_editAction) {
    return
  }
  const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex // 当前选中的航点
  if (_currentWayPointIndex === -1) {
    return
  }
  const picked = viewer.scene.pickPosition(e.position)
  const cartographic = Cesium.Cartographic.fromCartesian(picked)
  const endPosition = {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height
  }
  let _entity = null
  if (viewer.entities.getById('movePoint')) {
    _entity = viewer.entities.getById('movePoint')
  } else if (viewer.entities.getById('routePlanningWayPoint' + _currentWayPointIndex)) {
    _entity = viewer.entities.getById('routePlanningWayPoint' + _currentWayPointIndex)
  }
  if (!_entity) {
    return
  }
  const startPosition = MeasurementUtils.cartesianToLongAndLat(_entity.position.getValue())
  const startCartographic = Cesium.Cartesian3.fromDegrees(startPosition.longitude, startPosition.latitude, startPosition.altitude)
  const endCartographic = Cesium.Cartesian3.fromDegrees(endPosition.longitude, endPosition.latitude, endPosition.height)
  makeEntityTest([endPosition, startPosition])
  makeCone(startCartographic, endCartographic) // 视锥
  const yaw = getHeading(startCartographic, endCartographic)
  const pitch = getPitch(startCartographic, endCartographic)
  const _data = {
    pitch: Number(pitch.toFixed(0)),
    yaw: Number(yaw.toFixed(0))
  }
  store.commit('routePlanning/updateConeAngle', _data)
}

// 左键按下
function leftDownAction (e) {
  // 俯视状态
  startPoint = e.position
  const picked = viewer.scene.pick(e.position)
  if (picked && picked.id) {
    const editWayPoint = store.state.routePlanning.editWayPoint
    if (!editWayPoint) {
      // 非编辑状态
      return
    }
    leftDownFlag = true
    const pickList = viewer.scene.drillPick(e.position)
    const _pickList = []
    if (pickList.length <= 0) {
      return
    }
    pickList.map(item => {
      if (item && item.id) {
        _pickList.push(item.id.name)
      }
    })
    if ((_pickList.indexOf('routePlanningWayPoint') > -1 && _pickList.indexOf('movePoint') > -1) || _pickList.indexOf('movePoint') > -1) {
      // 航点和移动球在同一位置，禁止航点的选中操作，只能移动航点球
      const entity = viewer.entities.getById('movePoint')
      if (!entity) {
        return
      }
      startHeight = Cesium.Cartographic.fromCartesian(
        entity.position.getValue()
      ).height
      viewer._container.style.cursor = 'move'
      pickedEntity = entity
      if (pickedEntity && pickedEntity instanceof Cesium.Entity) {
        // 锁定相机
        viewer.scene.screenSpaceCameraController.enableRotate = false
        // 记录实体当前的位置
        currentPosition = pickedEntity.position.getValue(Cesium.JulianDate.fromDate(new Date()))
      } else {
        leftUpAction()
      }
    }
  }
}

// 鼠标移动
function mouseMoveAction (e) {
  if (leftDownFlag && pickedEntity) {
    viewer._container.style.cursor = 'move'
    let position2 = null
    if (overlookStatus) {
      // 俯视，移动 xy
      const cartesian = viewer.scene.camera.pickEllipsoid(
        e.endPosition,
        viewer.scene.globe.ellipsoid
      )
      // const ray = viewer.camera.getPickRay(e.endPosition)
      // const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      const _Cartesian3 = new Cesium.Cartesian3.fromDegrees(
        MeasurementUtils.cartesianToLongAndLat(cartesian).longitude,
        MeasurementUtils.cartesianToLongAndLat(cartesian).latitude,
        startHeight
      )
      position2 = _Cartesian3
      const inModel = modelDetection(pickedEntity.position.getValue(), position2)
      if (inModel) {
        return
      }
    } else {
      // 移动 z
      if (!startPoint) {
        return
      }
      const heightGap = e.endPosition.y - startPoint.y
      const cartographic = MeasurementUtils.cartesianToLongAndLat(pickedEntity.position.getValue())
      // height結果與cartographic.height相差無幾，注意：cartographic.height可以為0，也就是說，可以根據經緯度計算出高程。
      pickedEntityHeight = startHeight - (heightGap / 10)
      if (pickedEntityHeight < 0) {
        pickedEntityHeight = 0
      }
      position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, pickedEntityHeight)
      const inModel = modelDetection(pickedEntity.position.getValue(), position2)
      if (inModel) {
        return
      }
    }
    if (position2) {
      setMovePointEntityNewPosition(pickedEntity, position2)
    }
  }
}

/**
 * @description: 左键抬起
 * @return {*}
 */
function leftUpAction () {
  viewer._container.style.cursor = 'default'
  leftDownFlag = false
  pickedEntity = null
  currentPosition = null
  // 解除相机锁定
  viewer.scene.screenSpaceCameraController.enableRotate = true
}

/**
 * @description: 操作杆模式
 * @param {*} type
 * @param {*} value
 * @return {*}
 */
export function actionBarsModal (type, value) {
  if (!viewer.entities.getById('movePoint')) {
    return
  }
  const entity = viewer.entities.getById('movePoint')
  const step = Math.floor(cameraZ / 15)
  const cartographic = cloneDeep(MeasurementUtils.cartesianToLongAndLat(entity.position.getValue()))
  let _height = Number(parseFloat(Cesium.Cartographic.fromCartesian(
    entity.position.getValue()
  ).height).toFixed(2))
  let position2 = null
  if (type === 'z') {
    if (value === 'up') {
      _height += 1
    } else {
      if (_height > 0) {
        _height += -1
      } else {
        _height = 0
      }
    }
    position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, _height)
    const inModel = modelDetection(entity.position.getValue(), position2)
    if (inModel) {
      return
    }
  } else {
    let deg = 0
    const heading = Number(parseFloat(viewer.camera.heading * (180 / Math.PI)).toFixed(0))
    if (value === 'up') {
      deg = 0
    } else if (value === 'down') {
      deg = 180
    } else if (value === 'left') {
      deg = 90
    } else if (value === 'right') {
      deg = 270
    }
    const _deg = heading - deg
    const _distancePos = tool.distancePos(
      cartographic.longitude,
      cartographic.latitude,
      _deg, step < 1 ? 1 : step)
    const _Cartesian3Deg = new Cesium.Cartesian3.fromDegrees(
      parseFloat(_distancePos[0]).toFixed(7),
      parseFloat(_distancePos[1]).toFixed(7),
      _height
    )
    position2 = _Cartesian3Deg
    const inModel = modelDetection(entity.position.getValue(), position2)
    if (inModel) {
      return
    }
  }
  if (position2) {
    setMovePointEntityNewPosition(entity, position2)
  }
}

/**
 * @description: 视图定位到航线处（根据航点生成航线）
 * @param {*} data
 * @return {*}
 */
export function flyToRoute (data) {
  const _list = []
  data.map((point) => {
    if (point.longitude && point.latitude && point.altitude) {
      _list.push(Number(point.longitude))
      _list.push(Number(point.latitude))
      _list.push(Number(point.altitude))
    }
  })
  viewer.entities.getById('flyToRoute') ? viewer.entities.remove(viewer.entities.getById('flyToRoute')) : void (0)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: 'flyToRoute',
    name: 'flyToRoute',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(_list),
      width: 1,
      material: new Cesium.PolylineDashMaterialProperty({
        color: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0)
      }),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      show: true
    }
  }))
  entitiesIds.push('flyToRoute')
  setTimeout(() => {
    viewer.flyTo(entity, {
      duration: 1,
      offset: new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(-30),
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(0)
      )
    })
  })
}

/**
 * @description: 设置航线实体元素显隐
 * @param {*} idPrefix
 * @param {*} status
 * @return {*}
 */
function handleRouteEntitiesVisible (idPrefix, status) {
  let _entitiesIds = uniq(entitiesIds)
  if (idPrefix) {
    _entitiesIds = _entitiesIds.filter(_ =>
      _.indexOf(idPrefix) > -1
    )
    _entitiesIds.map(id => {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        if (id.indexOf('WayPoint') > -1) {
          // 航点
          if (status) {
            _entity.billboard.show = true
            _entity.label.show = true
          } else {
            _entity.billboard.show = false
            _entity.label.show = false
          }
        }
        if (id.indexOf('HeadingLine') > -1) {
          // 机头朝向
          if (status) {
            _entity.polyline.show = true
          } else {
            _entity.polyline.show = false
          }
        }
        if (id.indexOf('ActionCylinder') > -1) {
          // 云台视角
          if (status) {
            _entity.box.show = true
          } else {
            _entity.box.show = false
          }
        }
        if (id.indexOf('AltitudeLabel') > -1) {
          // 海拔
          if (status) {
            _entity.label.show = true
          } else {
            _entity.label.show = false
          }
        }
        if (id.indexOf('PlanningRoute') > -1) {
          // 航线
          if (status) {
            _entity.polyline.show = true
          } else {
            _entity.polyline.show = false
          }
        }
        if (id.indexOf('DistanceLabel') > -1) {
          // 距离
          if (status) {
            _entity.label.show = true
          }
        }
      }
    })
  }
}


/**
 * @description: 清除航线实体
 * @param {*} idPrefix
 * @return {*}
 */
export function clearRouteEntities (idPrefix) {
  let _entitiesIds = []
  if (idPrefix) {
    if (idPrefix === 'all') {
      _entitiesIds = uniq(entitiesIds)
    } else {
      _entitiesIds = uniq(entitiesIds).filter(_ =>
        _.indexOf(idPrefix) > -1
      )
    }
  }
  if (_entitiesIds && _entitiesIds.length > 0) {
    _entitiesIds.map(id => {
      viewer.entities.getById(id) ? viewer.entities.remove(viewer.entities.getById(id)) : void (0)
    })
  }
  clearCone()
}

/**
 * @description: 绘制航线距离标注
 * @param {*} line
 * @param {*} index
 * @param {*} idPrefix
 * @return {*}
 */
function makeLineLabelEntityByTwoPoint (line, index, idPrefix) {
  const _id = idPrefix + 'DistanceLabel' + index
  pushEntityId(_id)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: _id,
    name: '距离',
    position: Cesium.Cartesian3.fromDegrees(line.center.longitude, line.center.latitude, line.center.altitude),
    data: {
      index
    },
    label: {
      text: line.distance + 'm',
      // font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
      showBackground: true,
      backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      show: line.distance > 0
    }
  }))
  entitiesIds.push(_id)
  return entity
}


/**
 * @description: 根据两个点绘制航线
 * @param {*} line
 * @param {*} index
 * @param {*} idPrefix
 * @return {*}
 */
function makeLineEntityByTwoPoint (line, index, idPrefix, routeColor) {
  if (line && line.points) {
    const _id = idPrefix + 'PlanningRoute' + index
    pushEntityId(_id)
    const _position = []
    line.points.map((point) => {
      _position.push(Number(parseFloat(point.longitude)))
      _position.push(Number(parseFloat(point.latitude)))
      _position.push(Number(parseFloat(point.altitude)))
    })
    const entity = viewer.entities.add(new Cesium.Entity({
      id: _id,
      name: '航线',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(_position),
        width: 6,
        arcType: Cesium.ArcType.RHUMB,
        material: new Cesium.PolylineDashMaterialProperty({
          color: new Cesium.Color.fromCssColorString(routeColor || '#FCB718').withAlpha(1),
          dashLength: 10 // 短划线长度
        }),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2)
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
      }
    }))
    return entity
  }
}

/**
 * @description: 绘制总航程
 * @param {*} list
 * @param {*} idPrefix
 * @return {*}
 */
function makeTotalDistanceLabelEntity (list, idPrefix, distanceTotal) {
  const _distanceTotal = distanceTotal.toFixed(2)
  let total = 0
  if (list && list.length > 0) {
    total = computedVoyageByWayPoint(list, distanceTotal)
    const point = list[list.length - 1]
    const _id = idPrefix + 'AltitudeLabelTotalDistance'
    pushEntityId(_id)
    const _text = `航程：${_distanceTotal}m/${total}min`
    const entity = viewer.entities.add(new Cesium.Entity({
      id: _id,
      name: '航程',
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
      label: {
        text: _text,
        // font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
        showBackground: true,
        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        show: true
      }
    }))
  }
  return total
}

/**
 * @description: 绘制航点海拔
 * @param {*} list
 * @param {*} idPrefix
 * @return {*}
 */
function makePointAltitudeLabelEntity (list, idPrefix) {
  if (list && list.length > 0) {
    list.map((point, index) => {
      const _id = idPrefix + 'AltitudeLabel' + index
      pushEntityId(_id)
      const _text = '海拔：' + Number(parseFloat(point.altitude).toFixed(2)) + 'm'
      const entity = viewer.entities.add(new Cesium.Entity({
        id: _id,
        name: '海拔',
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        data: {
          index
        },
        label: {
          text: _text,
          // font: '14px sans-serif',
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0.0, 30.0),
          showBackground: true,
          backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          show: true
        }
      }))
      return entity
    })
  }
}

/**
 * @description: 绘制航点方向
 * @param {*} list
 * @param {*} idPrefix
 * @return {*}
 */
function makeHeadingEntity (list, idPrefix) {
  if (list && list.length > 0) {
    list.map((point, index) => {
      const cPoint = cloneDeep(point)
      // 添加方向实体
      const toPoint = tool.distancePos(cPoint.longitude, cPoint.latitude, cPoint.heading, 10)
      if (toPoint && toPoint.length > 0) {
        const _toPoint = {
          longitude: parseFloat(toPoint[0]),
          latitude: parseFloat(toPoint[1]),
          altitude: point.altitude
        }
        const _list = [point.longitude, point.latitude, point.altitude, _toPoint.longitude, _toPoint.latitude, _toPoint.altitude]
        const _id = idPrefix + 'HeadingLine' + index
        pushEntityId(_id)
        const entity = viewer.entities.add(
          new Cesium.Entity({
            id: _id,
            name: '机头朝向',
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(_list),
              width: 10,
              material: new Cesium.PolylineArrowMaterialProperty(
                new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
              ),
              scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
            }
          })
        )
        return entity
      }
    })
  }
}

/**
 * @description: 绘制动作方向椎体
 * @param {*} list
 * @param {*} idPrefix
 * @return {*}
 */
function makeActionCylinder (list, idPrefix) {
  if (list && list.length > 0) {
    list.map((point, index) => {
      if (point.actionEntityList && point.actionEntityList.length > 0) {
        point.actionEntityList.map((action, actionIndex) => {
          const _id = idPrefix + 'ActionCylinder' + index + '' + actionIndex
          pushEntityId(_id)
          // const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(point.heading + 90), Cesium.Math.toRadians(Number(action.pitch) + 90), Cesium.Math.toRadians(0))
          // const entity = viewer.entities.add(
          //   new Cesium.Entity({
          //     id: _id,
          //     name: '圆锥',
          //     position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
          //     orientation: Cesium.Transforms.headingPitchRollQuaternion(
          //       Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
          //       hpr
          //     ),
          //     cylinder: {
          //       length: 20.0,
          //       topRadius: 0.0,
          //       bottomRadius: 0.1,
          //       heightReference: Cesium.HeightReference.NONE,
          //       fill: true,
          //       material: new Cesium.Color.fromCssColorString('#ffffff'),
          //       outline: false,
          //       outlineWidth: 1.0,
          //       numberOfVerticalLines: 16,
          //       shadows: Cesium.ShadowMode.DISABLED
          //       // slices: 4
          //     },
          //     scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          //     distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
          //   })
          // )

          const length = 40
          let position = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
          const dir = MeasurementUtils.getVector(point, Number(point.heading + action.yaw))
          const forward_l = length * Math.cos(action.pitch * Math.PI / 180)
          position = MeasurementUtils.translateByDirection(position, dir, forward_l)
          const y_offset = length * Math.sin(action.pitch * Math.PI / 180)
          const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
          const lat = Cesium.Math.toDegrees(cartographic.latitude)
          const lon = Cesium.Math.toDegrees(cartographic.longitude)
          position = new Cesium.Cartesian3.fromDegrees(lon, lat, point.altitude - y_offset)

          const entity = viewer.entities.add(new Cesium.Entity({
            id: _id,
            position: position,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll.fromDegrees(Number(point.heading + action.yaw), 0, -1 * action.pitch)),
            box: {
              dimensions: new Cesium.Cartesian3(0.3, length * 2, 0.3),
              material: new Cesium.PolylineArrowMaterialProperty(
                new Cesium.Color.fromCssColorString('#fff').withAlpha(1)
              ),
              outline: false
            }
          }))
          return entity
        })

        // 视野
        // point.actionEntityList.map((action, actionIndex) => {
        //   const _id = idPrefix + 'ActionCylinderB' + action.id
        //   pushEntityId(_id)
        //   const entity = viewer.entities.add(
        //     new Cesium.Entity({
        //       id: _id,
        //       name: '圆锥',
        //       position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //       orientation: Cesium.Transforms.headingPitchRollQuaternion(
        //         Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        //         new Cesium.HeadingPitchRoll(action.yaw || 0, action.pitch || 0, action.roll || 0)
        //       ),
        //       cylinder: {
        //         pixelOffset: new Cesium.Cartesian2(0.0, 5.0),
        //         length: 10.0,
        //         topRadius: 0.1,
        //         bottomRadius: 5.0,
        //         heightReference: Cesium.HeightReference.NONE,
        //         fill: true,
        //         material: new Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.2),
        //         outline: false,
        //         outlineWidth: 1.0,
        //         numberOfVerticalLines: 16,
        //         shadows: Cesium.ShadowMode.DISABLED
        //         // slices: 4
        //       },
        //       scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        //       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0)
        //     })
        //   )
        //   return entity
        // })
      }
    })
  }
}

/**
 * @description: 绘制航点
 * @param {*} list
 * @param {*} idPrefix
 * @return {*}
 */
function makeWayPointEntity (list, idPrefix, wayPointImage, indexReverse) {
  if (list && list.length > 0) {
    list.map((point, index) => {
      let _label = ''
      if (point.collection && point.collection.length > 0) {
        // 一个位置存在多个点
        _label = point.collection.map(_ => _.index).join('\n')
      } else {
        if (indexReverse) {
          _label = list.length - index + ''
        } else {
          _label = index + 1 + ''
        }
      }
      const _id = idPrefix + 'WayPoint' + index
      pushEntityId(_id)
      const entity = viewer.entities.add(new Cesium.Entity({
        id: _id,
        name: '航点',
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
        data: {
          index
        },
        billboard: {
          image: wayPointImage,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          scale: 1,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          show: true
        },
        label: {
          text: _label,
          // font: '14px sans-serif',
          fillColor: new Cesium.Color.fromCssColorString(wayPointImage ? '#fff' : '#000'),
          outlineColor: new Cesium.Color.fromCssColorString(wayPointImage ? '#fff' : '#000'),
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
}

/**
 * @description: 绘制航线（航点，航线，距离，海拔）
 * @param {*} options
 * @return {*}
 */
function handleMakeRouteEntity (options) {
  const _list = options.list
  const _idPrefix = options.idPrefix
  const _wayPointImage = options.wayPointImage || require('@/assets/images/controls/routePlanning/point.png')
  const _routeColor = options.routeColor || '#FCB718'
  const _distanceLabel = options.distanceLabel
  const _heading = options.heading
  const _action = options.action
  const _altitudeLabel = options.altitudeLabel
  const _totalDistance = options.totalDistance
  const _indexReverse = options.indexReverse
  let planeTime = 0
  let distanceTotal = 0
  if (_list && _list.length > 0) {
    // 用第一个航点检测航线是否已存在，如果存在，不再添加
    const _id0 = _idPrefix + 'WayPoint' + 0
    const entity0 = viewer.entities.getById(_id0)
    if (entity0 && entity0 instanceof Cesium.Entity) {
      return
    }
    // 绘制航点
    makeWayPointEntity(_list, _idPrefix, _wayPointImage, _indexReverse)
    if (_heading) {
      // 绘制航点方向
      makeHeadingEntity(_list, _idPrefix)
    }
    if (_action) {
      // 绘制动作方向椎体
      makeActionCylinder(_list, _idPrefix)
    }
    if (_altitudeLabel) {
      // 绘制海拔
      makePointAltitudeLabelEntity(_list, _idPrefix)
    }
    // 航点两两拆分成线段，计算距离，绘制航线，并添加距离标注
    const lineSegment = MeasurementUtils.makeLineSegment(_list)
    if (lineSegment && lineSegment.length > 0) {
      lineSegment.map((line, index) => {
        // 绘制航线
        if (line && line.points && line.points.length > 0) {
          makeLineEntityByTwoPoint(line, index, _idPrefix, _routeColor)
        }
        // 绘制航线距离标注
        if (line && line.center && line.distance) {
          distanceTotal += Number(parseFloat(Number(line.distance).toFixed(2))) // 计算总距离
          if (_distanceLabel) {
            makeLineLabelEntityByTwoPoint(line, index, _idPrefix)
          }
        }
      })
      if (_totalDistance) {
        // 绘制总航程
        planeTime = makeTotalDistanceLabelEntity(_list, _idPrefix, distanceTotal)
      }
    }
  }
  // 设置下当前选中的航点的样式
  const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex
  setCurrentWayPointStyle(_currentWayPointIndex)
  return {
    distanceTotal: distanceTotal.toFixed(2), // 总距离
    planeTime: planeTime  // 预计航时
  }
}

/**
 * @description: 根据两点计算朝向角度
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
function getHeadingDegByTwoPoints (pointA, pointB) {
  const point1 = turf.point([pointA.longitude, pointA.latitude])
  const point2 = turf.point([pointB.longitude, pointB.latitude])
  const result = Number(parseFloat(turf.bearing(point1, point2)).toFixed(0)) // 当前镜头与目标位角度
  return result
}

/**
 * @description: 处理航点数据
 * @param {*} list
 * @param {*} status true：坐标一致的作为一个实体
 * @return {*}
 */
function handleWayPointData (list, status) {
  const fList = list.filter(
    _ => MeasurementUtils.gegLongAndLat(_.longitude, _.latitude)
  )
  if (fList <= 0) {
    return
  }

  // 处理 heading === -2 的航点（机头朝向下一个航点）
  for (let index = 0; index < list.length; index++) {
    const element1 = list[index]
    if (element1.heading === -2) {
      const element2 = list[index + 1]
      if (element1 && element2) {
        element1.heading = getHeadingDegByTwoPoints(element1, element2)
      }
    }
  }

  let result = []
  const tempArr = []
  // 按需取航点数据
  const _list = fList.map((_, index) => {
    return {
      index: index + 1,
      latitude: Number(_.latitude),
      longitude: Number(_.longitude),
      altitude: Number(_.altitude),
      heading: Number(_.heading),
      actionEntityList: _.actionEntityList || [], // way_point 接口返回的动作在 actionEntityList 中
      action: _.action || [] // tower/route 接口返回的动作在 action 中
    }
  })
  if (status) {
    // 归类（存在一个问题，因为归类了实体是一个，所以编辑时通过 id 可能找不到实体）
    for (let i = 0; i < _list.length; i++) {
      if (findObjIndex(tempArr, _list[i]) === -1) {
        result.push({
          index: _list[i].index,
          longitude: _list[i].longitude,
          latitude: _list[i].latitude,
          altitude: _list[i].altitude,
          collection: [_list[i]]
        })
        tempArr.push(_list[i])
      } else {
        for (let j = 0; j < result.length; j++) {
          if (
            result[j].longitude === _list[i].longitude &&
            result[j].latitude === _list[i].latitude &&
            result[j].altitude === _list[i].altitude
          ) {
            // 坐标一样，归类
            result[j].collection.push(_list[i])
            break
          }
        }
      }
    }
  } else {
    result = _list
  }
  return result
}

/**
 * @description: 找出航点在航点列表中的位置
 * @param {*} list
 * @param {*} obj
 * @return {*}
 */
function findObjIndex (list, obj) {
  const index = findIndex(list, function (_) {
    return _.longitude === obj.longitude &&
      _.latitude === obj.latitude &&
      _.altitude === obj.altitude
  })
  return index
}

/**
 * @description: 绘制航线
 * @param {*} options 航点数据、ID 前缀、是否定位到航线处、航点图标、航线颜色
 * @return {*}
 * 示例：
    makeRouteEntities({
      list: list, // 航点数据
      idPrefix: 'routeList', // 航线所有元素 ID 前缀（用于多处绘制/清除航线）
      fly: true, // 是否定位到航线处
      wayPointImage: require('@/assets/images/newUI/RoutePlanning/pointGreen.png'), // 航点图标
      routeColor: '#008000', // 航线颜色
      distanceLabel: true, // 是否显示航线距离标注
      heading: true, // 是否显示机头朝向
      action: true, // 是否显示动作朝向
      altitudeLabel: true, // 是否显示海拔
      totalDistance: true, // 是否显示总航程
      indexReverse: true // 航点序号倒序显示
    })
 */
export function makeRouteEntities (options) {
  const _options = cloneDeep(options)
  if (!_options.list || _options.list.length <= 0) {
    console.warn('未获取到航点数据')
    return
  }
  if (!_options.idPrefix) {
    console.warn('请设置实体 ID 前缀')
    return
  }
  const _list = handleWayPointData(_options.list, false) // 经过处理的航点数据（坐标一致的归为一个航点，heading === -2 朝向下一个航点）
  _options.list = _list
  clearRouteEntities(_options.idPrefix)
  if (_options.fly) {
    // 飞到航线处
    flyToRoute(_options.list)
  }
  const result = handleMakeRouteEntity(_options)
  return result
}

/**
 * @description: 检测航点球是否碰撞到模型
 * @param {*} position
 * @param {*} position2
 * @return {*}
 */
const instanceInModel = debounce(function (position, position2) {
  const inModel = _getIntersectObj(position, position2)
  if (inModel && inModel.length > 0) {
    console.log('.........inModel', inModel)
    const _data = inModel[0]
    const _position = _data.position
    const _entity = viewer.entities.getById('movePoint')
    if (_entity && _entity instanceof Cesium.Entity) {
      setMovePointEntityNewPosition(_entity, _position)
    }
  }
}, 400)

/**
 * @description: 航点实体移动后的位置信息
 * @param {*} position
 * @return {*}
 */
const updateMoveEntityNewPosition = debounce(function (position) {
  if (position) {
    let _data = {}
    const longLat = MeasurementUtils.cartesianToLongAndLat(position)
    _data = {
      longitude: Number(parseFloat(longLat.longitude).toFixed(7)),
      latitude: Number(parseFloat(longLat.latitude).toFixed(7)),
      altitude: Number(parseFloat(longLat.altitude).toFixed(2))
    }
    store.commit('routePlanning/updateWayPointNewPosition', _data)
  }
})

/**
 * @description: 设置航点球实体新的位置
 * @param {*} entity
 * @param {*} position2
 * @return {*}
 */
function setMovePointEntityNewPosition (entity, position2) {
  entity.position = new Cesium.CallbackProperty(function () {
    return position2
  }, false)
  updateMoveEntityNewPosition(entity.position.getValue())
}

/**
 * @description: 清除实体拖动状态
 * @return {*}
 */
export function clearEntityMoveStatus () {
  if (pickedEntity) {
    pickedEntity.billboard.scale = 1
    pickedEntity = null
  }
  leftUpAction()
}

/**
 * @description: 清除航点球
 * @param {*} type
 * @param {*} position
 * @return {*}
 */
export function clearMovePointEntity () {
  viewer.entities.getById('movePoint') ? viewer.entities.remove(viewer.entities.getById('movePoint')) : void (0)
}

/**
 * @description: 设置航点球位置
 * @param {*} position
 * @return {*}
 */
export const setMovePointEntityPosition = debounce(function (position) {
  // 高度默认为机库的高度
  const currentDockAltitude = Number(parseFloat(store.state.deviceInfo.dockInfo.altitude) + 10) || 10
  let _position = {}
  if (position) {
    _position = {
      longitude: Number(parseFloat(position.longitude)),
      latitude: Number(parseFloat(position.latitude)),
      altitude: Number(parseFloat(position.altitude || currentDockAltitude))
    }
  } else {
    if (centerPosition) {
      _position = {
        longitude: Number(parseFloat(centerPosition.longitude)),
        latitude: Number(parseFloat(centerPosition.latitude)),
        altitude: Number(parseFloat(centerPosition.altitude || currentDockAltitude))
      }
    }
  }
  if (_position.longitude && _position.latitude) {
    pickedEntityHeight = 0
    const _entity = viewer.entities.getById('movePoint')
    if (_entity && _entity instanceof Cesium.Entity) {
      const position2 = new Cesium.Cartesian3.fromDegrees(
        _position.longitude,
        _position.latitude,
        _position.altitude
      )
      _entity.position = new Cesium.CallbackProperty(function () {
        return position2
      }, false)
      updateMoveEntityNewPosition(_entity.position.getValue())
    }
  }
})

/**
 * @description: 设置航点球显示隐藏
 * @param {Boolean} status
 * @return {*}
 */
export function setMovePointEntityVisible (status) {
  const entity = viewer.entities.getById('movePoint')
  if (entity && entity instanceof Cesium.Entity) {
    if (status === 'hide') {
      entity.billboard.show = false
    } else if (status === 'show') {
      entity.billboard.show = true
    }
  }
}

/**
 * @description: 添加航点球
 * @return {*}
 */
export function makeMovePointEntity () {
  const currentDockAltitude = Number(parseFloat(store.state.deviceInfo.dockInfo.altitude) + 10) || 10
  viewer.entities.getById('movePoint') ? viewer.entities.remove(viewer.entities.getById('movePoint')) : void (0)
  const roll = viewer.camera.roll * (180 / Math.PI)
  let _image = require('@/assets/images/controls/routePlanning/z.png')
  if (roll === 0) {
    _image = require('@/assets/images/controls/routePlanning/xy.png')
  }
  const centerPosition = tool.getCameraCenterPosition()
  const entity = new Cesium.Entity({
    id: 'movePoint',
    name: 'movePoint', // 和鼠标按下，点击到的实体判断的 name 一致
    position: Cesium.Cartesian3.fromDegrees(centerPosition.longitude, centerPosition.latitude, centerPosition.altitude || currentDockAltitude),
    billboard: {
      image: _image,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      scale: 0.8,
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      show: true
    }
  })
  viewer.entities.add(entity)
  setMovePointEntityPosition()
}
