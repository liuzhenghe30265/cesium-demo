/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import {
  filter
  // debounce,
  // includes,
  // isEqual,
  // findIndex,
  // uniq,
  // cloneDeep
} from 'lodash'

/**
 * @description: 数组前一项和后一项组成一个新数组（把航点两两组成线段，并计算线段的距离）
 * @param {*} array
 * @return {*}
 */
function makeLineSegment (array) {
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
function getSpaceDistance (positions) {
  const _positions = filter(positions, _ => { return _ })
  let distance = 0
  for (let i = 0; i < _positions.length - 1; i++) {
    const point1cartographic = Cesium.Cartographic.fromCartesian(
      _positions[i]
    )
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
function gegLongAndLat (longitude, latitude) {
  const patt = /^(([1-9]\d*)(\.\d+)?)$|^0\.\d*[1-9]$/ // 不为 0
  if (patt.test(longitude) && patt.test(latitude)) {
    const longPatt = /^[\\-\\+]?(0?\d{1,2}(\.\d{1,15})*|1[0-7]?\d{1}(\.\d{1,15})*|180(\.0{1,15})*)$/
    const latPatt = /^[\\-\\+]?([0-8]?\d{1}(\.\d{1,15})*|90(\.0{1,15})*)$/
    if (longPatt.test(longitude) && latPatt.test(latitude)) {
      return true
    }
  }
}

/**
 * @description: 根据两个点找出中点
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
function getTwoPointCenter (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const _pointA = Cesium.Cartesian3.fromDegrees(pointA.longitude, pointA.latitude, pointA.altitude)
  const _pointB = Cesium.Cartesian3.fromDegrees(pointB.longitude, pointB.latitude, pointB.altitude)
  const center = new Cesium.Cartesian3(
    (_pointA.x + _pointB.x) / 2,
    (_pointA.y + _pointB.y) / 2,
    (_pointA.z + _pointB.z) / 2
  )
  return cartesianToLongAndLat(center)
}

/**
 * @description: 计算两点距离
 * @param {*} pointA
 * @param {*} pointB
 * @return {*}
 */
function getTwoPointDistance (pointA, pointB) {
  if (!pointA || !pointB) {
    return
  }
  const _distance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(pointA.longitude, pointA.latitude, pointA.altitude),
    Cesium.Cartesian3.fromDegrees(pointB.longitude, pointB.latitude, pointB.altitude)
  ).toFixed(2)
  return _distance
}

/**
 * @description: 计算两点间中心位置
 * @param {*} a Cartesian3
 * @param {*} b Cartesian3
 * @return {*} Cartesian3
 */
function getCenterPointByToPoint (a, b) {
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
function cartesianToWindowPosition (position) {
  const result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position)
  return result
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

function handleAddANoFlyZone (item, index) {
  NoFlyZoneIds.push('noFlyZone' + index)
  NoFlyZoneIds.push('noFlyZoneLabel' + index)
  // const stripeMaterial = new Cesium.StripeMaterialProperty({
  //   evenColor: Cesium.Color.YELLOW.withAlpha(0.15),
  //   oddColor: Cesium.Color.BLACK.withAlpha(0.15),
  //   repeat: 30.0
  // })
  const polyEntity = viewer.entities.add({
    name: 'Wyoming',
    id: 'noFlyZone' + index,
    // polygon: {
    //   hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
    //   height: 0,
    //   material: stripeMaterial,
    //   outline: true,
    //   outlineColor: Cesium.Color.YELLOW,
    //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
    //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2)
    // }
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(item.list)
      ),
      extrudedHeight: 50.0,
      material: new Cesium.Color.fromCssColorString('#ff0000').withAlpha(0.1),
      outline: true,
      outlineColor: new Cesium.Color.fromCssColorString('#ff0000'),
      show: false
    }
  })
  const polyPositions = polyEntity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
  const pCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
  const pCenterPosition = cartesianToLongAndLat(pCenter)

  const entity = viewer.entities.add(new Cesium.Entity({
    name: 'point',
    id: 'noFlyZoneLabel' + index,
    position: new Cesium.Cartesian3.fromDegrees(pCenterPosition.longitude, pCenterPosition.latitude, 50),
    label: {
      text: '禁飞区',
      font: '62px sans-serif',
      fillColor: new Cesium.Color.fromCssColorString('#fff'),
      outline: false,
      // outlineColor: new Cesium.Color.fromCssColorString('#fff'),
      // pixelOffset: new Cesium.Cartesian2(0.0, 30.0),
      outlineWidth: 1,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      showBackground: true,
      backgroundColor: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
      scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
      show: false
    }
  }))
}

let NoFlyZoneIds = []
// 添加禁飞区
function addANoFlyZone (list) {
  list.map((item, index) => {
    handleAddANoFlyZone(item, index)
  })
}

// 设置禁飞区显示隐藏
function setNoFlyZonVisible (status) {
  NoFlyZoneIds.map((id) => {
    const _entity = viewer.entities.getById(id)
    if (_entity) {
      if (status) {
        if (id.indexOf('noFlyZoneLabel') > -1) {
          _entity.label.show = true
        } else {
          _entity.polygon.show = true
        }
      } else {
        if (id.indexOf('noFlyZoneLabel') > -1) {
          _entity.label.show = false
        } else {
          _entity.polygon.show = false
        }
      }
    }
  })
}

/**
 * @description: 计算向量
 * @param {*} point
 * @param {*} yaw
 * @return {*}
 */
function getVector (point, yaw) {
  const A = new Cesium.Cartesian3.fromDegrees(Number(parseFloat(point.longitude)), Number(parseFloat(point.latitude)), Number(parseFloat(point.altitude)))
  const B = new Cesium.Cartesian3.fromDegrees(Number(parseFloat(point.longitude)), Number(parseFloat(point.latitude)) + 0.0001, Number(parseFloat(point.altitude)))

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
  makeLineSegment,
  getVector,
  translateByDirection,
  setNoFlyZonVisible,
  addANoFlyZone,
  getSpaceDistance,
  gegLongAndLat,
  getTwoPointCenter,
  getTwoPointDistance,
  getCenterPointByToPoint,
  cartesianToWindowPosition,
  cartesianToLongAndLat
}