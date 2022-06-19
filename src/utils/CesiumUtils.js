/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

/**
 * @description: 计算距离点位角度为 deg 的点位
 * @param {*} lng
 * @param {*} lat
 * @param {*} deg
 * @param {*} distance
 * @return {*}
 */
function distancePos (lng, lat, deg, distance) {
  return {
    longitude: lng + distance * Math.sin(deg * Math.PI / 180) * 180 / (Math.PI * 6371229 * Math.cos(lat * Math.PI / 180)),
    latitude: lat + distance * Math.cos(deg * Math.PI / 180) / (Math.PI * 6371229 / 180)
  }
}

/**
 * @description: 计算向量
 * @param {*} point
 * @param {*} yaw
 * @return {*}
 */
function getVector (point, yaw) {
  const A = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
  const B = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude + 0.0001, point.altitude)

  // 计算B的地面法向量
  const chicB = Cesium.Cartographic.fromCartesian(B)
  chicB.height = 0
  const dB = Cesium.Cartographic.toCartesian(chicB)
  const normaB = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(dB, B, new Cesium.Cartesian3()), new Cesium
    .Cartesian3())

  // 构造基于B的法向量旋转90度的矩阵
  const Q = Cesium.Quaternion.fromAxisAngle(normaB, Cesium.Math.toRadians(yaw))
  const m3 = Cesium.Matrix3.fromQuaternion(Q)
  const m4 = Cesium.Matrix4.fromRotationTranslation(m3)

  // 计算A点相对B点的坐标A1
  const A1 = Cesium.Cartesian3.subtract(B, A, new Cesium.Cartesian3())

  // 对A1应用旋转矩阵
  const p = Cesium.Matrix4.multiplyByPoint(m4, A1, new Cesium.Cartesian3())
  return p
}

/**
 * @description: 根据起点，方向和偏移计算终点
 * @param {*} point
 * @param {*} yaw
 * @return {*}
 */
function translateByDirection (start, direction, offset) {
  const normalize = Cesium.Cartesian3.normalize(
    direction,
    new Cesium.Cartesian3()
  )

  // 根据偏移量求偏移向量
  const scalerNormalize = Cesium.Cartesian3.multiplyByScalar(
    normalize,
    offset,
    new Cesium.Cartesian3()
  )
  return Cesium.Cartesian3.add(
    start,
    scalerNormalize,
    new Cesium.Cartesian3()
  )
}

export default {
  translateByDirection,
  getVector,
  distancePos
}