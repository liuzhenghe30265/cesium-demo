// 航线规划

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import tool from '@/utils/tool'
import store from '@/store'
import {
  EqualPosition,
  getVector,
  translateByDirection,
  cartesianToLongAndLat,
  makeLineSegment,
  PositionIsLegal,
  getHeadingDegByTwoPoints
} from './common'
import { _getIntersectObj } from '@/utils/hushi/autoWaypoint.js'
import {
  debounce,
  includes,
  isEqual,
  findIndex,
  uniq,
  cloneDeep
} from 'lodash'
import Vue from 'vue'

const entitiesIds = []

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
const currentWayPointIndex = -1 // 当前选中的航点
let centerPosition = null // 中心点
let startPoint = null
let startHeight = 0
let cameraZ = 0 // 相机高度
let playbackData = [] // 任务预览的航点数据

function pushEntityId(id) {
  entitiesIds.push(id)
}

/**
 * @description: 改变当前选中的航点实体的样式
 * @param {Number} watchCurrentWayPointIndex // 选中的航点索引
 * @return {*}
 */
export function setCurrentWayPointStyle(watchCurrentWayPointIndex) {
  const _entitiesIds = uniq(entitiesIds).filter(_ =>
    _.indexOf('routePlanningWayPoint') > -1
  )
  _entitiesIds.map(id => {
    if (viewer.entities.getById(id)) {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.billboard.scale = 1
        _entity.billboard.image = _entity.data && _entity.data.turnType == 2 ? require('@/assets/images/controls/routePlanning/point_w.png') : require('@/assets/images/controls/routePlanning/point.png')
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
export function setCurrentActionOrientation(watchCurrentWayPointIndex, watchCurrentActionIndex, selectWayPoint, actionChangeData, nextWayPoint) {
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
        const _yaw = parseFloat(_heading) + parseFloat(actionChangeData.yaw)
        const _pitch = actionChangeData.pitch
        let position = new Cesium.Cartesian3.fromDegrees(selectWayPoint.longitude, selectWayPoint.latitude, selectWayPoint.altitude)
        const dir = getVector(selectWayPoint, _yaw)
        const forward_l = length * Math.cos(_pitch * Math.PI / 180)
        position = translateByDirection(position, dir, forward_l)
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
 * @description: 改变当前选中的动作角度辅助线长度
 * @param {Number} watchCurrentWayPointIndex // 选中的航点索引
 * @param {Number} watchCurrentActionIndex // 选中的额动作索引
 * @return {*}
 */
export function setCurrentActionSublimeLength(watchCurrentWayPointIndex, watchCurrentActionIndex, length) {
  const _entitiesIds = uniq(entitiesIds).filter(_ =>
    _.indexOf('routePlanningActionCylinder') > -1
  )
  _entitiesIds.map(id => {
    if (viewer.entities.getById(id)) {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.box.dimensions = new Cesium.Cartesian3(0.3, 10 * 2, 0.3)
      }
    }
  })
  if (watchCurrentActionIndex > -1) {
    const _id = 'routePlanningActionCylinder' + watchCurrentWayPointIndex + '' + watchCurrentActionIndex
    if (viewer.entities.getById(_id)) {
      const _entity = viewer.entities.getById(_id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.box.dimensions = new Cesium.Cartesian3(0.3, length * 2, 0.3)
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
export function setCurrentActionStyle(watchCurrentWayPointIndex, watchCurrentActionIndex) {
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
export function lookingDownNew(longitude, latitude, altitude) {
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
      const position = cartesianToLongAndLat(movePointEntity.position.getValue(viewer.clock.currentTime))
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
export function lookingDown(status) {
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
        const _position = cartesianToLongAndLat(movePointEntity.position.getValue(viewer.clock.currentTime))
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
export function setTrackedEntity(status) {
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
function modelDetection(start, end) {
  return false
  // const excludeArr = viewer.entities.values.filter(item =>
  //   item.name === '航点' ||
  //   item.name === '机头朝向' ||
  //   item.name === '海拔' ||
  //   item.name === '航线' ||
  //   item.name === '距离' ||
  //   item.name === 'flyToRoute' ||
  //   item.name === 'movePoint' ||
  //   item.name === 'waypoint' ||
  //   item.name === 'tower' ||
  //   item.name === '虎鲸'
  // )
  // const result = _getIntersectObj(start, end, excludeArr)
  // const entity = viewer.entities.getById('movePoint')
  // if (result && result.length > 0) {
  //   entity.billboard.color = new Cesium.Color.fromCssColorString('#ff0000')
  //   return true
  // } else {
  //   entity.billboard.color = new Cesium.Color.fromCssColorString('#fff')
  //   return false
  // }
}

/**
 * @description: 移除鼠标事件
 * @return {*}
 */
export function removeInputActionFun() {
  if (routePlanningHandler) {
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    routePlanningHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}

/**
 * @description: 计算拍照数量
 * @param {*} list
 * @param {*} distanceTotal
 * @param {*} planeTime
 * @return {*}
 */
function computedPhotoCount(list, distanceTotal, planeTime) {
  let count = 0
  if (list[0].actionEntityList && list[0].actionEntityList[0]) {
    // 等时和等距用第一个航点的第一个动作判断
    const first = list[0].actionEntityList[0]
    if (first.action === 1 || first.action === 2) {
      for (let index = 0; index < list.length; index++) {
        const point = list[index]
        if (!point || !point.actionEntityList || !point.actionEntityList.length) {
          return
        }
        for (let pointIndex = 0; pointIndex < point.actionEntityList.length; pointIndex++) {
          const action = point.actionEntityList[pointIndex]
          if (action.action === 1) {
            // 拍一张
            count += 1
          } else if (action.action === 2) {
            // 拍三张
            count += 3
          }
        }
      }
    } else if (first.action === 3) {
      // (time / 60).toFixed(2)
      // 等时间拍照
      count = parseInt((planeTime * 1000) / first.intervalTime)
    } else if (first.action === 4) {
      // 等距离拍照
      count = parseInt(distanceTotal / first.intervalDistance)
    }
  }
  return count
}

/**
 * @description: 通过航点列表计算航程
 * @param {*} list
 * @param {*} distanceTotal
 * @param {*} deviceAltitude
 * @return {*}
 */
function computedVoyageByWayPoint(list, distanceTotal, deviceAltitude) {
  const _deviceAltitude = deviceAltitude || store.state.deviceInfo.dockInfo.altitude || 0
  let time = 0
  let point_cnt = 0
  list.map((point, index) => {
    const cur_point = [
      parseFloat(point['longitude']) * 1.0,
      parseFloat(point['latitude']) * 1.0,
      parseFloat(point['altitude']) * 1.0
    ]
    if (point_cnt > 0) {
      if (point.actionEntityList && point.actionEntityList.length > 0) {
        point.actionEntityList.map(action => {
          if (parseFloat(action.camAction) !== 1 && parseFloat(action.camAction) !== 2) {
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
  return time
  // return (time / 60).toFixed(2)
}

/**
 * @description: 清除视锥
 * @return {*}
 */
export function clearCone() {
  if (newPrimitive) {
    newPrimitive.destroy()
  }
  const arr = ['testPoint0', 'testPoint1', 'testPoint2']
  arr.map((id) => {
    viewer.entities.getById(id) ? viewer.entities.remove(viewer.entities.getById(id)) : void (0)
  })
}

// 测试
function makeEntityTest(list) {
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
function getPitch2(fromPosition, toPosition) {
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
function getPitch(fromPosition, toPosition) {
  const finalPosition = new Cesium.Cartesian3()
  const matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition)
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
function getHeading(fromPosition, toPosition) {
  const finalPosition = new Cesium.Cartesian3()
  const matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition)
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
export function makeConeByHeadingPitchRoll(action, point) {
  // console.log('..............makeConeByHeadingPitchRoll', action, point)
  // const _position = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
  // const _hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(action.yaw + 90), Cesium.Math.toRadians(action.pitch + 90), Cesium.Math.toRadians(
  //   0))
  // const ray = new Cesium.Ray(_position, _hpr) // 无限延长的射线
  // console.log('............ray', ray)
  // const _point = {
  //   longitude: cartesianToLongAndLat(ray.origin).longitude,
  //   latitude: cartesianToLongAndLat(ray.origin).latitude,
  //   height: cartesianToLongAndLat(ray.origin).altitude,
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
function makeCone(startPosition, endPosition) {
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
export function init() {
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
function leftClickAction(e) {
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
function leftDoubleClickAction(e) {
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
  const startPosition = cartesianToLongAndLat(_entity.position.getValue(viewer.clock.currentTime))
  const startCartographic = Cesium.Cartesian3.fromDegrees(startPosition.longitude, startPosition.latitude, startPosition.altitude)
  const endCartographic = Cesium.Cartesian3.fromDegrees(endPosition.longitude, endPosition.latitude, endPosition.height)
  makeEntityTest([endPosition, startPosition])
  makeCone(startCartographic, endCartographic) // 视锥
  const yaw = getHeading(startCartographic, endCartographic)
  const pitch = getPitch(startCartographic, endCartographic)
  const _data = {
    pitch: parseFloat(pitch.toFixed(0)),
    yaw: parseFloat(yaw.toFixed(0))
  }
  store.commit('routePlanning/updateConeAngle', _data)
}

// 左键按下
function leftDownAction(e) {
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
        entity.position.getValue(viewer.clock.currentTime)
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
function mouseMoveAction(e) {
  if (leftDownFlag && pickedEntity) {
    viewer._container.style.cursor = 'move'
    let position2 = null
    if (overlookStatus) {
      // 俯视，移动 xy
      // const cartesian = viewer.scene.camera.pickEllipsoid(
      //   e.endPosition,
      //   viewer.scene.globe.ellipsoid
      // )
      const ray = viewer.camera.getPickRay(e.endPosition)
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      const _Cartesian3 = new Cesium.Cartesian3.fromDegrees(
        cartesianToLongAndLat(cartesian).longitude,
        cartesianToLongAndLat(cartesian).latitude,
        startHeight
      )
      position2 = _Cartesian3
      const inModel = modelDetection(pickedEntity.position.getValue(viewer.clock.currentTime), position2)
      if (inModel) {
        return
      }
    } else {
      // 移动 z
      if (!startPoint) {
        return
      }
      const heightGap = e.endPosition.y - startPoint.y
      const cartographic = cartesianToLongAndLat(pickedEntity.position.getValue(viewer.clock.currentTime))
      // height結果與cartographic.height相差無幾，注意：cartographic.height可以為0，也就是說，可以根據經緯度計算出高程。
      pickedEntityHeight = startHeight - (heightGap / 10)
      if (pickedEntityHeight < 0) {
        pickedEntityHeight = 0
      }
      position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, pickedEntityHeight)
      const inModel = modelDetection(pickedEntity.position.getValue(viewer.clock.currentTime), position2)
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
function leftUpAction() {
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
export function actionBarsModal(type, value) {
  if (!viewer.entities.getById('movePoint')) {
    return
  }
  const entity = viewer.entities.getById('movePoint')
  const step = Math.floor(cameraZ / 15)
  const cartographic = cloneDeep(cartesianToLongAndLat(entity.position.getValue(viewer.clock.currentTime)))
  let _height = parseFloat(Cesium.Cartographic.fromCartesian(
    entity.position.getValue(viewer.clock.currentTime)
  ).height.toFixed(2))
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
    const inModel = modelDetection(entity.position.getValue(viewer.clock.currentTime), position2)
    if (inModel) {
      return
    }
  } else {
    let deg = 0
    const heading = parseFloat(viewer.camera.heading * (180 / Math.PI)).toFixed(0)
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
    const inModel = modelDetection(entity.position.getValue(viewer.clock.currentTime), position2)
    if (inModel) {
      return
    }
  }
  if (PositionIsLegal(cartesianToLongAndLat(position2))) {
    setMovePointEntityNewPosition(entity, position2)
  }
}

/**
 * @description: 视图定位到航线处（根据航点生成航线）
 * @param {*} data
 * @return {*}
 */
export function flyToRoute(data) {
  const _list = []
  data.map((point) => {
    _list.push(parseFloat(point.longitude))
    _list.push(parseFloat(point.latitude))
    _list.push(parseFloat(point.altitude))
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
 * @description: 清除航线实体
 * @param {*} idPrefix
 * @return {*}
 */
export function clearRouteEntities(idPrefix, playback) {
  if (playback && playback === 'playback') {
    playbackData = []
  }
  if (playbackData.length === 0) {
    // 当前没有预览任务的数据
    hideOverlay('playback_button')
  }
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
function makeLineLabelEntityByTwoPoint(options) {
  const { line, index, idPrefix } = options
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
function makeLineEntityByTwoPoint(options) {
  const { line, index, idPrefix, routeColor } = options
  if (line && line.points) {
    const _id = idPrefix + 'PlanningRoute' + index
    pushEntityId(_id)
    const _position = []
    line.points.map((point) => {
      _position.push(parseFloat(point.longitude))
      _position.push(parseFloat(point.latitude))
      _position.push(parseFloat(point.altitude))
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
function makeTotalDistanceLabelEntity(options) {
  const { list, idPrefix, distanceTotal, visible } = options
  const _distanceTotal = distanceTotal.toFixed(2)
  let total = 0
  total = computedVoyageByWayPoint(list, distanceTotal)
  const _total = (total / 60).toFixed(2)
  const point = list[list.length - 1]
  const _id = idPrefix + 'AltitudeLabelTotalDistance'
  pushEntityId(_id)
  const _text = `航程：${_distanceTotal}m/${_total}min`
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
      show: visible
    }
  }))
  if (idPrefix === 'tempRoute') {
    store.commit('updatePlanTime', _total)
    store.commit('updateDistance', _distanceTotal)
  }
  return total
}

/**
 * @description: 绘制航点海拔
 * @param {*} list
 * @param {*} index
 * @param {*} idPrefix
 * @return {*}
 */
function makePointAltitudeLabelEntity(options) {
  const { point, index, idPrefix } = options
  const _id = idPrefix + 'AltitudeLabel' + index
  pushEntityId(_id)
  const _text = '海拔：' + parseFloat(point.altitude).toFixed(2) + 'm'
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
}

/**
 * @description: 绘制航点方向
 * @param {*} point
 * @param {*} index
 * @param {*} idPrefix
 * @return {*}
 */
function makeHeadingEntity(options) {
  const { point, index, idPrefix } = options
  // 添加方向实体
  const toPoint = tool.distancePos(point.longitude, point.latitude, point.heading, 10)
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
}

/**
 * @description: 绘制动作方向椎体
 * @param {*} point
 * @param {*} index
 * @param {*} idPrefix
 * @return {*}
 */
function makeActionCylinder(options) {
  const { point, index, idPrefix } = options
  if (point.actionEntityList && point.actionEntityList.length > 0) {
    point.actionEntityList.map((action, actionIndex) => {
      const _id = idPrefix + 'ActionCylinder' + index + '' + actionIndex
      pushEntityId(_id)
      const length = 10
      let position = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
      const dir = getVector(point, parseFloat(point.heading + action.yaw))
      const forward_l = length * Math.cos(action.pitch * Math.PI / 180)
      position = translateByDirection(position, dir, forward_l)
      const y_offset = length * Math.sin(action.pitch * Math.PI / 180)
      const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      const lon = Cesium.Math.toDegrees(cartographic.longitude)
      position = new Cesium.Cartesian3.fromDegrees(lon, lat, point.altitude - y_offset)

      const entity = viewer.entities.add(new Cesium.Entity({
        id: _id,
        position: position,
        name: '可视方向',
        orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll.fromDegrees(parseFloat(point.heading + action.yaw), 0, -1 * action.pitch)),
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
  }
}

/**
 * @description: 绘制航点
 * @param {*} point
 * @param {*} idPrefix
 * @param {*} wayPointImage
 * @param {*} indexReverse
 * @return {*}
 */
function makeWayPointEntity(options) {
  const { point, index, idPrefix, wayPointImage, pointLabel } = options
  const _id = idPrefix + 'WayPoint' + index
  pushEntityId(_id)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: _id,
    name: '航点',
    position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude),
    data: {
      index,
      turnType: point.turnType
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
      text: pointLabel,
      // font: '14px sans-serif',
      // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: new Cesium.Color.fromCssColorString((wayPointImage && point.turnType !== 2) ? '#fff' : '#2b2b2b'),
      outlineColor: new Cesium.Color.fromCssColorString((wayPointImage && point.turnType !== 2) ? '#fff' : '#FCB718'),
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
  return entity
}

/**
 * @description: 绘制航线（航点，航线，距离，海拔）
 * @param {*} options
 * @return {*}
 */
function handleMakeRouteEntity(options) {
  console.log('.............handleMakeRouteEntity', options)
  const list = options.list
  const idPrefix = options.idPrefix
  const wayPointImage = options.wayPointImage || require('@/assets/images/controls/routePlanning/point.png')
  const routeColor = options.routeColor || '#FCB718'
  const distanceLabel = options.distanceLabel
  const heading = options.heading
  const action = options.action
  const altitudeLabel = options.altitudeLabel
  const totalDistance = options.totalDistance
  const indexReverse = options.indexReverse
  let photoCount = 0
  let planeTime = 0
  let distanceTotal = 0
  if (!list || list.length <= 0) {
    return
  }
  // if (list && list.length > 0) {
  // 用第一个航点检测航线是否已存在，如果存在，不再添加
  const _id0 = idPrefix + 'WayPoint' + 0
  const entity0 = viewer.entities.getById(_id0)
  if (entity0 && entity0 instanceof Cesium.Entity) {
    return
  }
  list.map((point, index) => {
    // 绘制航点
    let pointLabel = ''
    if (point.collection && point.collection.length > 0) {
      // 一个位置存在多个点
      pointLabel = point.collection.map(_ => _.index).join('\n')
    } else if (index === 0 || index === list.length - 1) {
      // 起始点有图标，不显示序号
      pointLabel = ''
    } else {
      if (indexReverse) {
        pointLabel = list.length - index + ''
      } else {
        pointLabel = index + 1 + ''
      }
    }

    let _wayPointImage = wayPointImage
    if (point.turnType === 2) {
      _wayPointImage = require('@/assets/images/controls/routePlanning/point_w.png')
    }
    if (index === 0) {
      // 起飞点/返航点
      _wayPointImage = require('@/assets/images/controls/routePlanning/start0.png')
    } else if (index === list.length - 1) {
      _wayPointImage = require('@/assets/images/controls/routePlanning/end0.png')
      const _start = list[0]
      const _end = list[list.length - 1]
      if (EqualPosition(_start, _end)) {
        // 起始点在同一位置，使用相同图标
        _wayPointImage = require('@/assets/images/controls/routePlanning/start0.png')
      }
    }

    makeWayPointEntity({ point, index, idPrefix, wayPointImage: _wayPointImage, pointLabel })

    if (heading) {
      // 绘制航点方向
      makeHeadingEntity({ point, index, idPrefix })
    }

    if (action) {
      // 绘制动作方向椎体
      makeActionCylinder({ point, index, idPrefix })
    }

    if (altitudeLabel) {
      // 绘制海拔
      makePointAltitudeLabelEntity({ point, index, idPrefix })
    }
  })

  // 航点两两拆分成线段，计算距离，绘制航线，并添加距离标注
  const lineSegment = makeLineSegment(list)
  if (!lineSegment || lineSegment.length <= 0) {
    return
  }
  lineSegment.map((line, index) => {
    // 绘制航线
    if (line && line.points && line.points.length > 0) {
      makeLineEntityByTwoPoint({ line, index, idPrefix, routeColor })
    }
    // 绘制航线距离标注
    if (line && line.center && line.distance) {
      distanceTotal += parseFloat(parseFloat(line.distance).toFixed(2)) // 计算总距离
      if (distanceLabel) {
        makeLineLabelEntityByTwoPoint({ line, index, idPrefix })
      }
    }
  })
  // 总航程
  planeTime = makeTotalDistanceLabelEntity({ list, idPrefix, distanceTotal, totalDistance })
  // 根据总距离和航程，计算拍照数量
  photoCount = computedPhotoCount(list, distanceTotal, planeTime)

  // 设置下当前选中的航点的样式
  const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex
  setCurrentWayPointStyle(_currentWayPointIndex)
  return {
    photoCount: photoCount, // 拍照总数
    distanceTotal: distanceTotal.toFixed(2), // 总距离
    planeTime: (planeTime / 60).toFixed(2) // 预计航时
  }
}

/**
 * @description: 处理航点数据
 * @param {*} list
 * @param {*} status true：坐标一致的作为一个实体
 * @return {*}
 */
function handleWayPointData(list, status) {
  const fList = list.filter(
    _ => PositionIsLegal(_)
  )
  if (fList <= 0) {
    return
  }

  // 处理 heading === -2 的航点（机头朝向下一个航点）
  for (let index = 0; index < list.length; index++) {
    const element1 = list[index]
    if (element1 && element1.heading === -2) {
      const element2 = list[index + 1]
      if (element2) {
        element1.heading = parseFloat(getHeadingDegByTwoPoints(element1, element2).toFixed(2))
      }
    }
  }

  let result = []
  const tempArr = []
  // 按需取航点数据
  const _list = fList.map((_, index) => {
    return {
      index: index + 1,
      latitude: parseFloat(_.latitude),
      longitude: parseFloat(_.longitude),
      altitude: parseFloat(_.altitude),
      heading: parseFloat(_.heading),
      actionEntityList: _.actionEntityList || _.action || [], // way_point 接口返回的动作在 actionEntityList 中
      // action: _.action || [], // tower/route 接口返回的动作在 action 中
      turnType: _.turnType
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
          if (EqualPosition(result[j], _list[i])) {
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
function findObjIndex(list, obj) {
  const index = findIndex(list, function (_) {
    return _.longitude === obj.longitude &&
      _.latitude === obj.latitude &&
      _.altitude === obj.altitude
  })
  return index
}

/**
 * @description: 添加覆盖物图层
 * @param {*} domID
 * @param {*} position
 * @return {*}
 */
function hideOverlay(domID) {
  const htmlOverlay = document.getElementById(domID)
  if (!htmlOverlay) {
    return
  }
  htmlOverlay.style.zIndex = -1
  store.commit('routePlanning/updatePlaybackData', [])
}

/**
 * @description: 添加覆盖物图层
 * @param {*} domID
 * @param {*} position
 * @return {*}
 */
function makeOverlay(domID, position, idPrefix) {
  const htmlOverlay = document.getElementById(domID)
  if (!htmlOverlay) {
    return
  }
  htmlOverlay.style.zIndex = 999
  htmlOverlay.onclick = (event) => {
    event.stopPropagation()
    store.commit('routePlanning/updatePlaybackData', playbackData)
  }
  const scratch = new window.Cesium.Cartesian2()
  viewer.scene.preRender.addEventListener(function () {
    const _position = window.Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.altitude
    )
    const canvasPosition = window.viewer.scene.cartesianToCanvasCoordinates(
      _position,
      scratch
    )
    if (window.Cesium.defined(canvasPosition)) {
      if (htmlOverlay.style) {
        htmlOverlay.style.top = canvasPosition.y + 'px'
        htmlOverlay.style.left = canvasPosition.x + 'px'
      }
    }
  })
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
export function makeRouteEntities(options) {
  const _options = cloneDeep(options)
  if (!_options.list || _options.list.length <= 0) {
    console.warn('未获取到航点数据')
    // return
  }
  if (!_options.idPrefix) {
    console.warn('请设置实体 ID 前缀')
    return
  }
  const _list = handleWayPointData(_options.list, false) // 经过处理的航点数据（坐标一致的归为一个航点，heading === -2 朝向下一个航点）
  _options.list = _list
  playbackData = []
  if (_options.playback) {
    playbackData = _list
    makeOverlay('playback_button', _list[0], _options.idPrefix)
  }
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
    const longLat = cartesianToLongAndLat(position)
    _data = {
      longitude: parseFloat(longLat.longitude).toFixed(7),
      latitude: parseFloat(longLat.latitude).toFixed(7),
      altitude: parseFloat(longLat.altitude).toFixed(2)
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
function setMovePointEntityNewPosition(entity, position2) {
  entity.position = new Cesium.CallbackProperty(function () {
    return position2
  }, false)
  updateMoveEntityNewPosition(entity.position.getValue(viewer.clock.currentTime))
}

/**
 * @description: 清除实体拖动状态
 * @return {*}
 */
export function clearEntityMoveStatus() {
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
export function clearMovePointEntity() {
  viewer.entities.getById('movePoint') ? viewer.entities.remove(viewer.entities.getById('movePoint')) : void (0)
}

/**
 * @description: 设置航点球位置
 * @param {*} position
 * @return {*}
 */
export const setMovePointEntityPosition = debounce(function (position) {
  let _position = {}
  if (position) {
    _position = {
      longitude: parseFloat(position.longitude),
      latitude: parseFloat(position.latitude),
      altitude: parseFloat(position.altitude)
    }
  } else {
    if (centerPosition) {
      _position = {
        longitude: parseFloat(centerPosition.longitude),
        latitude: parseFloat(centerPosition.latitude),
        altitude: parseFloat(centerPosition.altitude)
      }
    }
  }
  if (PositionIsLegal(_position)) {
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
      updateMoveEntityNewPosition(_entity.position.getValue(viewer.clock.currentTime))
    }
  }
})

/**
 * @description: 设置航点球显示隐藏
 * @param {Boolean} status
 * @return {*}
 */
export function setMovePointEntityVisible(status) {
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
export function makeMovePointEntity() {
  const currentDockAltitude = parseFloat(store.state.deviceInfo.dockInfo.altitude) + 10 || 10
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
