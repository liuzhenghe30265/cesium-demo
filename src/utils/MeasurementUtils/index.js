// GIS 测量

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import tool from '@/utils/tool'
import store from '@/store'
import MeasurementUtils from './common'
import {
  filter,
  debounce,
  includes,
  isEqual,
  findIndex,
  uniq,
  cloneDeep
} from 'lodash'

let eventHandler = null
let cartesian = null
let poly = null
let distance = 0
let positions = [] // 每次点击的位置
let floatingPoint = null // 绘制的最后一个点（浮动状态）
let drawEntities = [] // 所有绘制的实体集合
let drawEntity = [] // 绘制的单个实体
let pickedEntity = null // 选中的实体（编辑）
let leftDownFlag = false // 左键按下
let overlookStatus = false // 俯视状态
let startPoint = null // 鼠标按下的位置
let startHeight = 0
let pickedEntityHeight = 0 // 被选中的 Entity 高度
let entitiesIds = []

function pushEntityId (id) {
  entitiesIds.push(id)
}

/**
 * @description: 清除所有实体
 * @param {*} idPrefix
 * @return {*}
 */
function clearAllEntities (idPrefix) {
  let _entitiesIds = uniq(entitiesIds)
  if (idPrefix) {
    _entitiesIds = _entitiesIds.filter(_ =>
      _.indexOf(idPrefix) > -1
    )
  }
  if (_entitiesIds && _entitiesIds.length > 0) {
    _entitiesIds.map(id => {
      viewer.entities.getById(id) ? viewer.entities.remove(viewer.entities.getById(id)) : void (0)
    })
  }
}

const PolyLinePrimitive = (function () {
  function _ (positions) {
    this.options = {
      name: '距离测量',
      id: 'SpaceDistanceLine',
      polyline: {
        positions: [],
        width: 3,
        color: new Cesium.Color.fromCssColorString('#fff'),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
        disableDepthTestDistance: 50000
      }
    }
    this.positions = positions
    this._init()
  }
  _.prototype._init = function () {
    var _self = this
    var _update = function () {
      return _self.positions
    }
    // 实时更新 polyline.positions
    this.options.polyline.positions = new Cesium.CallbackProperty(
      _update,
      false
    )
    viewer.entities.add(this.options)
  }
  return _
})()

// 重新绘制单条实体
function redrawEntity () {
  console.log('............drawEntities', drawEntity)
  if (drawEntity && drawEntity.length > 0) {
    drawEntity.map((item, index) => {

    })
  }
}

/**
 * @description: 绘制航线距离标注
 * @param {*} line
 * @param {*} index
 * @param {*} lineIndex
 * @return {*}
 */
function makeLineLabelEntityByTwoPoint (line, index, lineIndex) {
  const _id = `distanceLineLabel${index}${lineIndex}`
  pushEntityId(_id)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: _id,
    name: '距离',
    position: Cesium.Cartesian3.fromDegrees(line.center.longitude, line.center.latitude, line.center.altitude),
    data: {
      line,
      index,
      lineIndex
    },
    point: {
      pixelSize: 20,
      color: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      disableDepthTestDistance: 50000
    },
    label: {
      text: `${line.distance}m`,
      fillColor: Cesium.Color.WHITE,
      pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
      showBackground: true,
      backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      disableDepthTestDistance: 50000
    }
  }))
  entitiesIds.push(_id)
  return entity
}

/**
 * @description: 根据两个点绘制线段
 * @param {*} line
 * @param {*} index
 * @param {*} lineIndex
 * @return {*}
 */
function makeLineEntityByTwoPoint (line, index, lineIndex) {
  if (line && line.points) {
    const _id = `distanceLine${index}${lineIndex}`
    pushEntityId(_id)
    const _position = []
    line.points.map((point) => {
      _position.push(Number(parseFloat(point.longitude)))
      _position.push(Number(parseFloat(point.latitude)))
      _position.push(Number(parseFloat(point.altitude)))
    })
    const entity = viewer.entities.add(new Cesium.Entity({
      id: _id,
      name: '线段',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(_position),
        width: 3,
        color: new Cesium.Color.fromCssColorString('#fff'),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.RED
        }),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
        disableDepthTestDistance: 50000
      }
    }))
    return entity
  }
}

/**
 * @description: 绘制总距离
 * @param {*} position
 * @return {*}
 */
function makeTotalDistanceLabel (position, distance, index) {
  const _id = `totalDistanceLabel${index}`
  pushEntityId(_id)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: _id,
    name: '总长',
    position: position,
    label: {
      text: `总距离：${distance}m`,
      fillColor: Cesium.Color.WHITE,
      pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
      showBackground: true,
      backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      disableDepthTestDistance: 50000
    }
  }))
  return entity
}

/**
 * @description: 绘制点
 * @param {*} position
 * @param {*} index
 * @param {*} pointIndex
 * @return {*}
 */
function makePointEntity (position, index, pointIndex) {
  const _id = `distancePoint${index}${pointIndex}`
  pushEntityId(_id)
  const entity = viewer.entities.add(new Cesium.Entity({
    id: _id,
    name: '距离点',
    position: position,
    point: {
      pixelSize: 25,
      color: Cesium.Color.WHITE,
      outline: false,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      disableDepthTestDistance: 50000
    }
  }))
  return entity
}

/**
 * @description: 重新绘制所有实体
 * @return {*}
 */
function reDrawEntities () {
  // clearAllEntities()
  let entityPointions = []
  if (drawEntities && drawEntities.length > 0) {
    // 所有线段的坐标
    drawEntities.map((item) => {
      const _points = item.map(_ => _.position.getValue())
      const _lineSegment = MeasurementUtils.makeLineSegment(item.map(_ => MeasurementUtils.cartesianToLongAndLat(_.position.getValue())))
      const _totalDistanceArr = _lineSegment.map(_ => _.distance)
      const _totalDistance = parseFloat(_totalDistanceArr.reduce((a, b) => {
        return Number(a) + Number(b)
      })).toFixed(1)
      entityPointions.push(
        {
          points: _points,
          lineSegment: _lineSegment,
          totalDistance: _totalDistance
        }
      )
      if (item && item.length > 0) {
        item.map(entity => {
          // 清除绘制过程中生成的实体
          viewer.entities.remove(entity)
          viewer.entities.getById('SpaceDistanceLine') ? viewer.entities.remove(viewer.entities.getById('SpaceDistanceLine')) : void (0)
        })
      }
    })
  }
  entityPointions.map((item, index) => {
    const id0 = `distancePoint${index}0`
    const entity0 = viewer.entities.getById(id0)
    if (entity0 && entity0 instanceof Cesium.Entity) {
      return
    }
    if (item.points && item.points.length > 0) {
      // 点
      item.points.map((point, pointIndex) => {
        makePointEntity(point, index, pointIndex)
      })
      // 总距离
      const lastPoint = item.points[item.points.length - 1]
      makeTotalDistanceLabel(lastPoint, item.totalDistance, index)
    }
    if (item.lineSegment && item.lineSegment) {
      // 距离线段
      item.lineSegment.map((line, lineIndex) => {
        if (line && line.points && line.points.length > 0) {
          makeLineEntityByTwoPoint(line, index, lineIndex)
        }
        // 距离标注
        if (line && line.center && line.distance) {
          makeLineLabelEntityByTwoPoint(line, index, lineIndex)
        }
      })
    }
  })
}

// // 清除所有实体
// function clearAllEntities () {
//   if (drawEntity && drawEntity.length > 0) {
//     drawEntity.map(entity => {
//       entity && entity instanceof Cesium.Entity ? viewer.drawEntity.remove(entity) : void (0)
//     })
//   }
// }

/**
 * @description: 改变当前选中的测量中点的样式
 * @param {Number} index // 测量点在线段中的索引
 * @param {Number} lineIndex // 线段的索引
 * @return {*}
 */
function setCurrentMiddlePointStyle (data) {
  const _entitiesIds = uniq(entitiesIds).filter(_ =>
    _.indexOf('distanceLineLabel') > -1
  )
  _entitiesIds.map(id => {
    if (viewer.entities.getById(id)) {
      const _entity = viewer.entities.getById(id)
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.point.pixelSize = 20
      }
    }
  })
  pickedEntity = null
  leftDownFlag = false
  if (data.index > -1) {
    const entityId = `distanceLineLabel${data.index}${data.lineIndex}`
    if (viewer.entities.getById(entityId)) {
      const _entity = viewer.entities.getById(entityId)
      pickedEntity = _entity // 选中当前实体编辑
      leftDownFlag = true
      viewer._container.style.cursor = 'move'
      // 锁定相机
      viewer.scene.screenSpaceCameraController.enableRotate = false
      if (_entity && _entity instanceof Cesium.Entity) {
        _entity.point.pixelSize = 30
      }
    }
  }
}

/**
 * @description: 设置距离点实体新的位置
 * @param {*} entity
 * @param {*} position2
 * @return {*}
 */
function setMovePointEntityNewPosition (entity, position2) {
  entity.position = new Cesium.CallbackProperty(function () {
    return position2
  }, false)
  // updateMoveEntityNewPosition(entity.position.getValue())
}


/**
 * @description: 左键抬起
 * @return {*}
 */
function leftUpAction () {
  viewer._container.style.cursor = 'default'
  leftDownFlag = false
  pickedEntity = null
  // currentPosition = null
  // 解除相机锁定
  viewer.scene.screenSpaceCameraController.enableRotate = true
}

function rightClickAction (event) {
  positions.pop()
  drawEntities.push(drawEntity) // 把绘制好的线添加到实体集中
  reDrawEntities()
  store.commit('measurement/updateMeasureType', '')
}

/**
 * @description: 鼠标移动
 * @param {*} movement
 * @return {*}
 */
function mouseMoveAction (movement) {
  const measureType = store.state.measurement.measureType
  if (measureType === 'SPACE_DISTANCE') {
    // 距离测量
    const scene = viewer.scene
    if (scene.mode !== Cesium.SceneMode.MORPHING) {
      const pickedObject = scene.pick(movement.endPosition)
      if (
        scene.pickPositionSupported &&
        Cesium.defined(pickedObject)
      ) {
        cartesian = viewer.scene.pickPosition(
          movement.endPosition
        )
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions)
          } else {
            positions.pop()
            positions.push(cartesian)
          }
          distance = MeasurementUtils.getSpaceDistance(positions)
        }
      }
    }
  } else {
    // 移动点
    if (pickedEntity && pickedEntity instanceof Cesium.Entity) {
      if (leftDownFlag) {
        let position2 = null
        if (overlookStatus) {
          // 俯视，移动 xy
          const cartesian = viewer.scene.camera.pickEllipsoid(
            movement.endPosition,
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
        } else {
          // 移动 z
          if (!startPoint) {
            return
          }
          const heightGap = movement.endPosition.y - startPoint.y
          const cartographic = MeasurementUtils.cartesianToLongAndLat(pickedEntity.position.getValue())
          // height結果與cartographic.height相差無幾，注意：cartographic.height可以為0，也就是說，可以根據經緯度計算出高程。
          pickedEntityHeight = startHeight - (heightGap / 10)
          if (pickedEntityHeight < 0) {
            pickedEntityHeight = 0
          }
          position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, pickedEntityHeight)
        }
        if (position2) {
          setMovePointEntityNewPosition(pickedEntity, position2)
        }
      }
    }
  }
}

// 左键按下
function leftDownAction (e) {
  // 俯视状态
  startPoint = e.position
  // const picked = viewer.scene.pick(e.position)
  // if (picked && picked.id) {
  //   const editWayPoint = store.state.routePlanning.editWayPoint
  //   if (!editWayPoint) {
  //     // 非编辑状态
  //     return
  //   }
  //   leftDownFlag = true
  //   const pickList = viewer.scene.drillPick(e.position)
  //   const _pickList = []
  //   if (pickList.length <= 0) {
  //     return
  //   }
  //   pickList.map(item => {
  //     if (item && item.id) {
  //       _pickList.push(item.id.name)
  //     }
  //   })
  //   if ((_pickList.indexOf('routePlanningWayPoint') > -1 && _pickList.indexOf('movePoint') > -1) || _pickList.indexOf('movePoint') > -1) {
  //     // 航点和移动球在同一位置，禁止航点的选中操作，只能移动航点球
  //     const entity = viewer.entities.getById('movePoint')
  //     if (!entity) {
  //       return
  //     }
  //     startHeight = Cesium.Cartographic.fromCartesian(
  //       entity.position.getValue()
  //     ).height
  //     viewer._container.style.cursor = 'move'
  //     pickedEntity = entity
  //     if (pickedEntity && pickedEntity instanceof Cesium.Entity) {
  //       // 锁定相机
  //       viewer.scene.screenSpaceCameraController.enableRotate = false
  //       // 记录实体当前的位置
  //       currentPosition = pickedEntity.position.getValue(Cesium.JulianDate.fromDate(new Date()))
  //     } else {
  //       leftUpAction()
  //     }
  //   }
  // }
}

/**
 * @description: 左键点击
 * @param {*} event
 * @return {*}
 */
function leftClickAction (event) {
  const picked = viewer.scene.pick(event.position)
  const measureType = store.state.measurement.measureType
  if (measureType === 'SPACE_DISTANCE') {
    // 距离测量
    if (Cesium.defined(cartesian)) {
      if (positions.length === 0) {
        positions.push(cartesian.clone())
      }
      positions.push(cartesian)
      floatingPoint = viewer.entities.add({
        name: '距离测量',
        position: positions[positions.length - 1],
        point: {
          pixelSize: 25,
          color: Cesium.Color.WHITE,
          outline: false,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          disableDepthTestDistance: 50000
        },
        label: {
          text: `${distance}m`,
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0.0, 20.0),
          showBackground: true,
          backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
          disableDepthTestDistance: 50000
        }
      })
      drawEntity.push(floatingPoint)
    }
  } else if (measureType === 'SPACE_AREA') {
    // 面积测量
  } else {
    if (picked.id && picked.id.data) {
      const data = picked.id.data
      const _distancePointData = store.state.measurement.distancePointData
      _distancePointData.index === data.index && _distancePointData.lineIndex === data.lineIndex
        ? (store.commit('measurement/updateDistancePointData', {}))
        : (store.commit('measurement/updateDistancePointData', data))
      setCurrentMiddlePointStyle(store.state.measurement.distancePointData)
    }
  }
}

/**
 * @description: 移除鼠标事件
 * @return {*}
 */
function removeInputActionFun () {
  if (eventHandler) {
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
}

function initInputAction () {
  removeInputActionFun()
  eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  eventHandler.setInputAction(function (event) {
    leftClickAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  eventHandler.setInputAction(function (event) {
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  eventHandler.setInputAction(function (event) {
    leftDownAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  eventHandler.setInputAction(function (event) {
    leftUpAction()
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
  eventHandler.setInputAction(function (movement) {
    mouseMoveAction(movement)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  eventHandler.setInputAction(function (movement) {
    rightClickAction(movement)
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  viewer.camera.percentageChanged = 0.00001
  viewer.camera.changed.addEventListener(function (event) {
    cameraZ = viewer.camera.position.z
    centerPosition = tool.getCameraCenterPosition()
    const roll = viewer.camera.roll * (180 / Math.PI)
    if (roll === 0) {
      overlookStatus = true
    } else {
      overlookStatus = false
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

/**
 * @description: 重置绘制数据
 * @param {String} type
 * @return {*}
 */
function resetDrawData () {
  drawEntity = []
  positions = []
  cartesian = null
  poly = null
  pickedEntity = null
  leftDownFlag = false
  distance = 0
}

/**
 * @description: 测量
 * @param {String} type
 * @return {*}
 */
function measurementFun (type) {
  resetDrawData()
  if (type === 'clear') {
    drawEntities = []
    return
  }
}

/**
 * @description: 测量（使用 EarthSDK）
 * @param {String} type
 * @return {*}
 */
function measurementEarth (type) {
  if (type === 'clear') {
    earth.analyzation.measurement.clearResults()
    return
  }
  earth.analyzation.measurement.type = type
}

export default {
  clearAllEntities,
  measurementFun,
  measurementEarth,
  removeInputActionFun,
  initInputAction
}
