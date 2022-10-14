/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

/**
 * @description: 根据起点和 yaw pitch 计算终点
 * @param {*} viewer
 * @param {*} point
 * @param {*} heading
 * @param {*} action
 * @param {*} distance
 * @return {*}
 */
function getEndPointByYawPitch (viewer, point, heading, action, distance) {
  const { camera, scene } = viewer
  let position = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
  const dir = getVector({
    longitude: point.longitude,
    latitude: point.latitude,
    altitude: point.altitude
  }, Number(heading + action.yaw))
  const forward_l = distance * Math.cos(action.pitch * Math.PI / 180)
  position = translateByDirection(position, dir, forward_l)
  const y_offset = distance * Math.sin(action.pitch * Math.PI / 180)
  const cartographic = scene.globe.ellipsoid.cartesianToCartographic(position)
  const lat = Cesium.Math.toDegrees(cartographic.latitude)
  const lon = Cesium.Math.toDegrees(cartographic.longitude)
  position = new Cesium.Cartesian3.fromDegrees(lon, lat, point.altitude - y_offset)
  return position
}

/**
 * @description: 世界坐标转经纬度
 * @param {*} position
 * @return {*}
 */
function cartesianToLongAndLat (position) {
  const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const data = {
    longitude: Number(parseFloat(longitude).toFixed(7)),
    latitude: Number(parseFloat(latitude).toFixed(7)),
    altitude: Number(parseFloat(cartographic.height))
  }
  return data
}

/**
 * @description: 获取视图矩形范围
 * @return {*}
 */
function getExtend (viewer) {
  const extend = viewer.camera.computeViewRectangle()
  const params = {}
  if (typeof extend === 'undefined') {
    const coordToLonlat = (viewer, x, y) => {
      const { camera, scene } = viewer
      const d2 = new Cesium.Cartesian2(x, y)
      const ellipsoid = scene.globe.ellipsoid
      // 2D转3D世界坐标
      const d3 = camera.pickEllipsoid(d2, ellipsoid)
      // 3D世界坐标转弧度
      const upperLeftCartographic = scene.globe.ellipsoid.cartesianToCartographic(d3)
      // 弧度转经纬度
      const lon = Cesium.Math.toDegrees(upperLeftCartographic.longitude)
      const lat = Cesium.Math.toDegrees(upperLeftCartographic.latitude)
      return { lon, lat }
    }
    const canvas = viewer.scene.canvas
    const upperLeftLonLat = coordToLonlat(viewer, 0, 0)
    const lowerRightLonLat = coordToLonlat(viewer, canvas.clientWidth, canvas.clientHeight)
    params.xmin = upperLeftLonLat.lon
    params.xmax = lowerRightLonLat.lon
    params.ymin = upperLeftLonLat.lat
    params.ymax = lowerRightLonLat.lat
  } else {
    // 三维视图
    params.xmax = Cesium.Math.toDegrees(extend.east)
    params.ymax = Cesium.Math.toDegrees(extend.north)
    params.xmin = Cesium.Math.toDegrees(extend.west)
    params.ymin = Cesium.Math.toDegrees(extend.south)
  }
  return params
}

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
  getEndPointByYawPitch,
  cartesianToLongAndLat,
  getExtend,
  translateByDirection,
  getVector,
  distancePos
}