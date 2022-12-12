/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// cesium 工具

import {
  filter
  // debounce,
  // includes,
  // isEqual,
  // findIndex,
  // uniq,
  // cloneDeep
} from 'lodash'
import { point, bearing, polygon, area } from '@turf/turf'

/**
 * @description: 根据笛卡尔坐标点集合计算多边形面积
 * @param {*} points [Cartesian3, Cartesian3, Cartesian3]
 * @return {*}
 */
export function getPolygonArea (points) {
  let area = 0
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length
    area += points[i].x * points[j].y
    area -= points[i].y * points[j].x
  }
  area /= 2
  return Math.abs(area)
}

/**
 * @description: 根据多边形实体计算多边形中心点
 * @param {*} entity
 * @return {*}
 */
export function getPolygonCenterByEntity (entity) {
  if (entity && entity.polygon) {
    const _positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
    const _center = Cesium.BoundingSphere.fromPoints(_positions).center
    return _center
  }
}

/**
 * @description: 根据经纬度坐标点集合计算多边形中心点
 * @param {*} points
 * @return {*}
 */
export function getPolygonCenterByPoints (points) {
  const polygon = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights(points)
    )
  })
  const geometry = Cesium.PolygonGeometry.createGeometry(polygon)
  if (geometry && geometry.boundingSphere) {
    const center = geometry.boundingSphere.center
    return center
  }
}

/**
 * @description: 根据两点计算朝向角度
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
export function getHeadingDegByTwoPoints (pointA, pointB) {
  const point1 = point([pointA.longitude, pointA.latitude])
  const point2 = point([pointB.longitude, pointB.latitude])
  const result = parseFloat(bearing(point1, point2)) // 当前镜头与目标位角度
  return result
}

/**
 * @description: 根据起点和 yaw pitch 计算终点
 * @param {*} point
 * @param {*} heading
 * @param {*} action
 * @param {*} distance
 * @return {*}
 */
export function getEndPointByYawPitch (point, heading, action, distance) {
  const { scene } = viewer
  let position = new Cesium.Cartesian3.fromDegrees(
    point.longitude,
    point.latitude,
    point.altitude
  )
  const dir = getVector(
    {
      longitude: point.longitude,
      latitude: point.latitude,
      altitude: point.altitude
    },
    parseFloat(heading + action.yaw)
  )
  const forward_l = distance * Math.cos((action.pitch * Math.PI) / 180)
  position = translateByDirection(position, dir, forward_l)
  const y_offset = distance * Math.sin((action.pitch * Math.PI) / 180)
  const cartographic = scene.globe.ellipsoid.cartesianToCartographic(position)
  const lat = Cesium.Math.toDegrees(cartographic.latitude)
  const lon = Cesium.Math.toDegrees(cartographic.longitude)
  position = new Cesium.Cartesian3.fromDegrees(
    lon,
    lat,
    point.altitude - y_offset
  )
  return position
}

/**
 * @description: 数组前一项和后一项组成一个新数组（把航点两两组成线段，并计算线段的距离）
 * @param {*} array
 * @return {*}
 */
export function makeLineSegment (array) {
  const result = []
  for (let index = 0; index < array.length; index++) {
    const element1 = array[index]
    const element2 = array[index + 1]
    const _distance = getTwoPointDistance(element1, element2)
    if (element1 && element2) {
      result.push({
        distance: _distance,
        center: getTwoPointCenter(element1, element2),
        points: [element1, element2]
      })
    }
  }
  return result
}

/**
 * @description: 空间多点连线距离计算函数
 * @param {*} positions
 * @return {*}
 */
export function getSpaceDistance (positions) {
  const _positions = filter(positions, _ => {
    return _
  })
  let distance = 0
  for (let i = 0; i < _positions.length - 1; i++) {
    const point1cartographic = Cesium.Cartographic.fromCartesian(_positions[i])
    const point2cartographic = Cesium.Cartographic.fromCartesian(
      _positions[i + 1]
    )
    const geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    const s = geodesic.surfaceDistance
    distance = distance + s
  }
  return distance.toFixed(2)
}

/**
 * @description: 验证经纬度是否合法
 * @param {*} longitude
 * @param {*} latitude
 * @return {*}
 */
export function regLongAndLat (longitude, latitude) {
  const patt = /^(([1-9]\d*)(\.\d+)?)$|^0\.\d*[1-9]$/ // 不为 0
  if (patt.test(longitude) && patt.test(latitude)) {
    const longPatt =
      /^[\\-\\+]?(0?\d{1,2}(\.\d{1,15})*|1[0-7]?\d{1}(\.\d{1,15})*|180(\.0{1,15})*)$/
    const latPatt = /^[\\-\\+]?([0-8]?\d{1}(\.\d{1,15})*|90(\.0{1,15})*)$/
    if (longPatt.test(longitude) && latPatt.test(latitude)) {
      return true
    }
  }
}

/**
 * @description: 根据两个点（Cartesian）找出中点
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
export function getTwoCartesianPointCenter (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const center = new Cesium.Cartesian3(
    (pointA.x + pointB.x) / 2,
    (pointA.y + pointB.y) / 2,
    (pointA.z + pointB.z) / 2
  )
  return center
}

/**
 * @description: 根据两个点找出中点
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
export function getTwoPointCenter (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const _pointA = Cesium.Cartesian3.fromDegrees(
    pointA.longitude,
    pointA.latitude,
    pointA.altitude
  )
  const _pointB = Cesium.Cartesian3.fromDegrees(
    pointB.longitude,
    pointB.latitude,
    pointB.altitude
  )
  const center = new Cesium.Cartesian3(
    parseFloat((_pointA.x + _pointB.x)) / 2,
    parseFloat((_pointA.y + _pointB.y)) / 2,
    parseFloat((_pointA.z + _pointB.z)) / 2
  )
  return cartesianToLongAndLat(center)
}

/**
 * @description: 计算两点（Cartesian）距离
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
export function getTwoCartesianPointDistance (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const _distance = Cesium.Cartesian3.distance(
    pointA,
    pointB
  ).toFixed(2)
  return _distance
}

/**
 * @description: 计算两点距离
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
export function getTwoPointDistance (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const _distance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(
      pointA.longitude,
      pointA.latitude,
      pointA.altitude
    ),
    Cesium.Cartesian3.fromDegrees(
      pointB.longitude,
      pointB.latitude,
      pointB.altitude
    )
  ).toFixed(2)
  return _distance
}

/**
 * @description: 计算两点间中心位置
 * @param {*} a Cartesian3
 * @param {*} b Cartesian3
 * @return {*} Cartesian3
 */
export function getCenterPointByToPoint (a, b) {
  const center = new Cesium.Cartesian3(
    (a.x + b.x) / 2,
    (a.y + b.y) / 2,
    (a.z + b.z) / 2
  )
  return center
}

/**
 * @description: 世界坐标转换为屏幕坐标
 * @param {*} position
 * @return {*}
 */
export function cartesianToWindowPosition (position) {
  const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    position
  )
  return result
}

/**
 * @description: 经纬度转换为屏幕坐标
 * @param {*} position
 * @return {*}
 */
export function LongAndLatToWindowPosition (position) {
  const _position = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, position.altitude)
  const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    _position
  )
  return result
}

/**
 * @description: 世界坐标转经纬度
 * @param {*} Cartesian3
 * @return {*}
 */
export function cartesianToLongAndLat (position, test) {
  const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const data = {
    longitude: parseFloat(parseFloat(longitude).toFixed(7)),
    latitude: parseFloat(parseFloat(latitude).toFixed(7)),
    altitude: parseFloat(cartographic.height)
  }
  return data
}

/**
 * @description: 计算向量
 * @param {*} point
 * @param {*} yaw
 * @return {*}
 */
export function getVector (point, yaw) {
  const A = new Cesium.Cartesian3.fromDegrees(
    parseFloat(point.longitude),
    parseFloat(point.latitude),
    parseFloat(point.altitude)
  )
  const B = new Cesium.Cartesian3.fromDegrees(
    parseFloat(point.longitude),
    parseFloat(point.latitude) + 0.0001,
    parseFloat(point.altitude)
  )

  // 计算B的地面法向量
  const chicB = Cesium.Cartographic.fromCartesian(B)
  chicB.height = 0
  const dB = Cesium.Cartographic.toCartesian(chicB)
  const normaB = Cesium.Cartesian3.normalize(
    Cesium.Cartesian3.subtract(dB, B, new Cesium.Cartesian3()),
    new Cesium.Cartesian3()
  )

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
export function translateByDirection (start, direction, offset) {
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
  return Cesium.Cartesian3.add(start, scalerNormalize, new Cesium.Cartesian3())
}

/**
 * @description: 计算距离点位角度为 deg 的点位
 * @param {*} longitude
 * @param {*} latitude
 * @param {*} deg
 * @param {*} distance
 * @return {*}
 */
export function distancePos (longitude, latitude, deg, distance) {
  return {
    longitude: longitude + distance * Math.sin(deg * Math.PI / 180) * 180 / (Math.PI * 6371229 * Math.cos(latitude * Math.PI / 180)),
    latitude: latitude + distance * Math.cos(deg * Math.PI / 180) / (Math.PI * 6371229 / 180)
  }
}