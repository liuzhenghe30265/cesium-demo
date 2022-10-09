/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let viewer = null
let inputActionHandle = null

export function getCameraCenterPosition () {
  const result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2))
  let longitude = null
  let latitude = null
  if (result) {
    const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result)
    longitude = curPosition.longitude * 180 / Math.PI
    latitude = curPosition.latitude * 180 / Math.PI
  } else {
    longitude = Cesium.Math.toDegrees(
      viewer.scene.globe.ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).longitude
    )
    latitude = Cesium.Math.toDegrees(
      viewer.scene.globe.ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).latitude
    )
  }
  return {
    longitude,
    latitude
  }
}

export function makeMovePointEntity () {
  viewer.entities.getById('movePoint') ? viewer.entities.remove(viewer.entities.getById('movePoint')) : void (0)
  // const roll = viewer.camera.roll * (180 / Math.PI)
  // let _image = require('@/assets/images/controls/routePlanning/z.png')
  // if (roll === 0) {
  //   _image = require('@/assets/images/controls/routePlanning/xy.png')
  // }
  const centerPosition = getCameraCenterPosition()
  const entity = new Cesium.Entity({
    id: 'movePoint',
    name: 'movePoint', // 和鼠标按下，点击到的实体判断的 name 一致
    position: Cesium.Cartesian3.fromDegrees(centerPosition.longitude, centerPosition.latitude, centerPosition.altitude || 100),
    billboard: {
      image: require('@/assets/images/circle.png'),
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

function mouseMoveAction (e) {
  // if (leftDownFlag && pickedEntity) {
  //   viewer._container.style.cursor = 'move'
  //   let position2 = null
  //   if (overlookStatus) {
  //     // 俯视，移动 xy
  //     const cartesian = viewer.scene.camera.pickEllipsoid(
  //       e.endPosition,
  //       viewer.scene.globe.ellipsoid
  //     )
  //     // const ray = viewer.camera.getPickRay(e.endPosition)
  //     // const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
  //     const _Cartesian3 = new Cesium.Cartesian3.fromDegrees(
  //       MeasurementUtils.cartesianToLongAndLat(cartesian).longitude,
  //       MeasurementUtils.cartesianToLongAndLat(cartesian).latitude,
  //       startHeight
  //     )
  //     position2 = _Cartesian3
  //     const inModel = modelDetection(pickedEntity.position.getValue(), position2)
  //     if (inModel) {
  //       return
  //     }
  //   } else {
  //     // 移动 z
  //     if (!startPoint) {
  //       return
  //     }
  //     const heightGap = e.endPosition.y - startPoint.y
  //     const cartographic = MeasurementUtils.cartesianToLongAndLat(pickedEntity.position.getValue())
  //     // height結果與cartographic.height相差無幾，注意：cartographic.height可以為0，也就是說，可以根據經緯度計算出高程。
  //     pickedEntityHeight = startHeight - (heightGap / 10)
  //     if (pickedEntityHeight < 0) {
  //       pickedEntityHeight = 0
  //     }
  //     position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, pickedEntityHeight)
  //     const inModel = modelDetection(pickedEntity.position.getValue(), position2)
  //     if (inModel) {
  //       return
  //     }
  //   }
  //   if (position2) {
  //     setMovePointEntityNewPosition(pickedEntity, position2)
  //   }
  // }
}

function leftUpAction () {
  // viewer._container.style.cursor = 'default'
  // leftDownFlag = false
  // pickedEntity = null
  // currentPosition = null
  // // 解除相机锁定
  // viewer.scene.screenSpaceCameraController.enableRotate = true
}

function leftDownAction (e) {
  // // 俯视状态
  // startPoint = e.position
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

function leftDoubleClickAction (e) {
  // const _editAction = store.state.routePlanning.editAction // 编辑动作状态
  // if (!_editAction) {
  //   return
  // }
  // const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex // 当前选中的航点
  // if (_currentWayPointIndex === -1) {
  //   return
  // }
  // const picked = viewer.scene.pickPosition(e.position)
  // const cartographic = Cesium.Cartographic.fromCartesian(picked)
  // const endPosition = {
  //   longitude: Cesium.Math.toDegrees(cartographic.longitude),
  //   latitude: Cesium.Math.toDegrees(cartographic.latitude),
  //   height: cartographic.height
  // }
  // let _entity = null
  // if (viewer.entities.getById('movePoint')) {
  //   _entity = viewer.entities.getById('movePoint')
  // } else if (viewer.entities.getById('routePlanningWayPoint' + _currentWayPointIndex)) {
  //   _entity = viewer.entities.getById('routePlanningWayPoint' + _currentWayPointIndex)
  // }
  // if (!_entity) {
  //   return
  // }
  // const startPosition = MeasurementUtils.cartesianToLongAndLat(_entity.position.getValue())
  // const startCartographic = Cesium.Cartesian3.fromDegrees(startPosition.longitude, startPosition.latitude, startPosition.altitude)
  // const endCartographic = Cesium.Cartesian3.fromDegrees(endPosition.longitude, endPosition.latitude, endPosition.height)
  // makeEntityTest([endPosition, startPosition])
  // makeCone(startCartographic, endCartographic) // 视锥
  // const yaw = getHeading(startCartographic, endCartographic)
  // const pitch = getPitch(startCartographic, endCartographic)
  // const _data = {
  //   pitch: Number(pitch.toFixed(0)),
  //   yaw: Number(yaw.toFixed(0))
  // }
  // store.commit('routePlanning/updateConeAngle', _data)
}

function leftClickAction (e) {
  // // 选中航点效果
  // const picked = viewer.scene.pick(e.position)
  // if (!picked.id) {
  //   return
  // }
  // const editWayPoint = store.state.routePlanning.editWayPoint
  // if (!editWayPoint) {
  //   // 非编辑状态
  //   return
  // }
  // if (picked.id.data && picked.id.data.index > -1) {
  //   // 点击到了航点实体（航点实体反选航点）
  //   store.commit('routePlanning/updateCurrentActionIndex', -1) // 重置选中的动作
  //   const wayPointIndex = picked.id.data.index
  //   const _currentWayPointIndex = store.state.routePlanning.currentWayPointIndex
  //   _currentWayPointIndex === wayPointIndex
  //     ? (store.commit('routePlanning/updateWayPointIndex', -1))
  //     : (store.commit('routePlanning/updateWayPointIndex', wayPointIndex))
  // }
}

export function initInputActionFun () {
  inputActionHandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  inputActionHandle.setInputAction(function (event) {
    leftClickAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  inputActionHandle.setInputAction(function (event) {
    leftDoubleClickAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  inputActionHandle.setInputAction(function (event) {
    leftDownAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  inputActionHandle.setInputAction(function (event) {
    leftUpAction(event)
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
  inputActionHandle.setInputAction(function (movement) {
    mouseMoveAction(movement)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

export function removeInputActionFun () {
  if (inputActionHandle) {
    inputActionHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    inputActionHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    inputActionHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    inputActionHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
    inputActionHandle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}

export function reset () {
  viewer = null
  removeInputActionFun()
}

export function init (_viewer) {
  console.log('......Cesium', Cesium, viewer)
  reset()
  viewer = _viewer
  initInputActionFun()
  makeMovePointEntity()
}