// 设置坐标点

import {
  // GetCameraPositionInfo,
  PositionIsLegal,
  GetMouseEarthPosition,
  cartesianToLongAndLat
} from '../common'

export default class StartPointUtil {
  /**
   * @param {*}
   * @memberof StartPointUtil
   */
  constructor(options) {
    this.flyEntity = null
    this.eventHandler = null
    this.PickFinish = options.PickFinish
  }

  removeFlyEntity() {
    if (this.flyEntity && this.flyEntity instanceof Cesium.Entity) {
      viewer.entities.remove(this.flyEntity)
    }
  }

  addFlyEntity(position) {
    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        position.altitude
      ),
      point: new Cesium.PointGraphics({
        color: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0),
        // pixelSize: 40,
        // outlineWidth: 2,
        // outlineColor: Cesium.Color.fromCssColorString('#fff')
      })
    })
    return entity
  }

  FlyToEntity(position) {
    this.removeFlyEntity()
    this.flyEntity = this.addFlyEntity(position)
    viewer.flyTo(this.flyEntity, {
      // duration: 1
    })
  }

  mouseMoveAction() {
    viewer._container.style.cursor = 'crosshair'
  }

  leftClickAction(event) {
    const mouseResult = GetMouseEarthPosition(event.position)
    const earthPosition = mouseResult.earthPosition
    if (!earthPosition) {
      return
    }
    // const _this = this
    const _earthPositionObj = Object.assign({
      x: earthPosition.x,
      y: earthPosition.y,
      z: earthPosition.z
    })
    const _earthPosition = new Cesium.Cartesian3(_earthPositionObj.x, _earthPositionObj.y, _earthPositionObj.z)
    const position = cartesianToLongAndLat(_earthPosition)
    if (position && PositionIsLegal(position)) {
      if (this.PickFinish) {
        this.PickFinish(position)
      }
    }
  }

  removeInputActionFun() {
    if (this.eventHandler) {
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
  }

  initInputActionFun() {
    const _this = this
    this.removeInputActionFun()
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.eventHandler.setInputAction(function (event) {
      _this.leftClickAction(event)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.eventHandler.setInputAction(function (movement) {
      _this.mouseMoveAction(movement)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  Init(position, cb) {
    // const cameraPositionInfo = GetCameraPositionInfo()
    // const _position = cameraPositionInfo.position || position
    // const _orientation = cameraPositionInfo.orientation
    this.removeFlyEntity()
    this.initInputActionFun()
    viewer.scene.screenSpaceCameraController.enableTilt = false
    // viewer.scene.screenSpaceCameraController.enableTranslate = false
    // viewer.scene.screenSpaceCameraController.enableRotate = false
    // viewer.scene.screenSpaceCameraController.enableZoom = false
    viewer._container.style.cursor = 'crosshair'
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.altitude),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0
      },
      duration: 1,
      complete: function (e) {
        if (cb) {
          cb()
        }
      }
    })
  }

  Destory(cb) {
    viewer.scene.screenSpaceCameraController.enableTilt = true
    viewer._container.style.cursor = 'default'
    this.removeInputActionFun()
    this.removeFlyEntity()
    this.eventHandler = null
    this.flyEntity = null
    if (cb) {
      cb()
    }
  }
}
