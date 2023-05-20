// 电子围栏
let fenceHandle = null
import { MessageBox } from 'element-ui'

export function removeEntity() {
  viewer.entities.getById('fenceEntity') ? viewer.entities.remove(viewer.entities.getById('fenceEntity')) : void (0)
}

export function removeFenceHandle() {
  if (fenceHandle) {
    fenceHandle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
  removeEntity()
}

export function initFence() {
  removeFenceHandle()
  fenceHandle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  fenceHandle.setInputAction(function (event) {
    const earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
    const cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
    const longitude = Cesium.Math.toDegrees(cartographic.longitude)
    const latitude = Cesium.Math.toDegrees(cartographic.latitude)
    if (longitude && latitude) {
      MessageBox.prompt('请输入半径', '提示', {
        confirmButtonText: '下一步',
        showCancelButton: false,
        inputPattern: /\S/,
        inputErrorMessage: '请输入半径',
        customClass: 'custom_prompt'
      }).then(({ value }) => {
        const _value = parseInt(value)
        if (!_value) {
          return
        }
        removeEntity()
        viewer.entities.add({
          id: 'fenceEntity',
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
          ellipse: {
            semiMinorAxis: _value,
            semiMajorAxis: _value,
            material: Cesium.Color.RED.withAlpha(0.2),
            outlineColor: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })
      }).catch(() => {

      })
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
