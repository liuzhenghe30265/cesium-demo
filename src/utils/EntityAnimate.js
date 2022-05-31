/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

const data = {
  deviationR: 1,
  minR: 0,
  maxR: 100
}
let r1 = data.minR

export function semiMinorAxisAnimate () {
  const CallbackProperty = new Cesium.CallbackProperty(function () {
    return r1
  }, false)
  return CallbackProperty
}

export function semiMajorAxisAnimate () {
  const CallbackProperty = new Cesium.CallbackProperty(function () {
    r1 = r1 + data.deviationR
    if (r1 >= data.maxR) {
      r1 = data.minR
    }
    return r1
  }, false)
  return CallbackProperty
}

export function colorOpacityAnimate () {
  const CallbackProperty = new Cesium.CallbackProperty(function () {
    const alp = 1 - r1 / 100
    return Cesium.Color.WHITE.withAlpha(alp)
  }, false)
  return CallbackProperty
}

export function opacityAnimate () {
  let flag = true
  let value = 1
  const CallbackProperty = new window.Cesium.CallbackProperty(function () {
    if (flag) {
      value = value - 0.03
      flag = !(value <= 0)
    } else {
      value = value + 0.03
      flag = value >= 1
    }
    return window.Cesium.Color.WHITE.withAlpha(value)
  }, false)
  return CallbackProperty
}

export function scaleAnimate () {
  let flag = true
  let value = 1
  const CallbackProperty = new window.Cesium.CallbackProperty(function () {
    if (flag) {
      value = value - 0.02
      flag = !(value <= 0.8)
    } else {
      value = value + 0.02
      flag = value >= 1.4
    }
    return value
  }, false)
  return CallbackProperty
}