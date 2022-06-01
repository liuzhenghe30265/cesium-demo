/* eslint-disable no-undef */
import * as turf from '@turf/turf'

/**
 * @description: 根据多边形裁切模型
 * @param {*} tileset 模型
 * @param {*} polygon 多边形
 * @param {*} model 裁切方式（正切/反切）
 * @return {*}
 */
export function cutModelByPolygon (tileset, polygon, model) {
  tileset.readyPromise.then((_tileset) => {
    const inverseTransform = getInverseTransform(_tileset) // 转换矩阵
    // 切割的多边形
    const cutPolygon = polygon
    const cutList = isDirRes(cutPolygon, !model)

    const clippingPlanes1 = []
    for (let i = 0; i < cutList.length - 1; i++) {
      const plane = createPlane(cutList[i], cutList[i + 1], inverseTransform)
      clippingPlanes1.push(plane)
    }
    // 创建裁剪平面
    const clippingPlanes = new Cesium.ClippingPlaneCollection({
      // 一组 ClippingPlane 对象，用于选择性地禁用每个平面外部的渲染
      planes: clippingPlanes1,
      // 应用于裁剪对象的边缘的高光的宽度（以像素为单位）
      unionClippingRegions: model,
      edgeWidth: 1.0
    })
    _tileset.clippingPlanes = clippingPlanes
  })
}

export function createPlaneUpdateFunction (plane) {
  return function () {
    return plane
  }
}

/**
 * @description: 给模型添加切割面
 * @param {*} url 模型地址
 * @param {*} clippingPlanes 切割面
 * @return {*}
 */
export function createClippingPlaneFun (url, clippingPlanes) {
  const option = {
    url: url,
    maximumScreenSpaceError: 8,
    clippingPlanes: clippingPlanes
  }
  const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset(option)
  )
  tileset.readyPromise.then(function (tileset) {
    if (
      !Cesium.Matrix4.equals(
        tileset.root.transform,
        Cesium.Matrix4.IDENTITY
      )
    ) {
      // The clipping plane is initially positioned at the tileset's root transform.
      // Apply an additional matrix to center the clipping plane on the bounding sphere center.
      const transformCenter = Cesium.Matrix4.getTranslation(
        tileset.root.transform,
        new Cesium.Cartesian3()
      )
      const transformCartographic = Cesium.Cartographic.fromCartesian(
        transformCenter
      )
      const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      )
      const height =
        boundingSphereCartographic.height -
        transformCartographic.height
      clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
        new Cesium.Cartesian3(0.0, 0.0, height)
      )
      // 添加平面实体（调试用）
      // const planeEntities = []
      // const boundingSphere = tileset.boundingSphere
      // const radius = boundingSphere.radius
      // for (let i = 0; i < clippingPlanes.length; ++i) {
      //   const plane = clippingPlanes.get(i)
      //   const planeEntity = viewer.entities.add({
      //     position: boundingSphere.center,
      //     plane: {
      //       dimensions: new Cesium.Cartesian2(
      //         radius,
      //         radius
      //       ),
      //       material: Cesium.Color.RED.withAlpha(0.5),
      //       plane: new Cesium.CallbackProperty(
      //         createPlaneUpdateFunction(plane),
      //         false
      //       ),
      //       outline: false,
      //       outlineColor: Cesium.Color.RED
      //     }
      //   })
      //   planeEntities.push(planeEntity)
      // }
      return tileset
    }
  })
  return tileset
}

export function isDirRes (polygon, isClockwise) {
  const lineStringList = []
  polygon.forEach((p) => {
    lineStringList.push([p[0], p[1]])
  })

  const clockwiseRing = turf.lineString(lineStringList)
  const isR = turf.booleanClockwise(clockwiseRing)

  let points = []
  if (isClockwise) {
    if (!isR) {
      points = polygon
    } else {
      let count = 0
      for (let ii = polygon.length - 1; ii >= 0; ii--) {
        points[count] = polygon[ii]
        count++
      }
    }
  } else {
    if (isR) {
      points = polygon
    } else {
      let count = 0
      for (let ii = polygon.length - 1; ii >= 0; ii--) {
        points[count] = polygon[ii]
        count++
      }
    }
  }
  return points
}

export function getOriginCoordinateSystemPoint (point, inverseTransform) {
  const val = Cesium.Cartesian3.fromDegrees(point[0], point[1])
  return Cesium.Matrix4.multiplyByPoint(
    inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
}

/**
 * @description: 创建平面
 * @param {*} p1
 * @param {*} p2
 * @param {*} inverseTransform
 * @return {*}
 */
export function createPlane (p1, p2, inverseTransform) {
  const p1C3 = getOriginCoordinateSystemPoint(p1, inverseTransform)
  const p2C3 = getOriginCoordinateSystemPoint(p2, inverseTransform)
  const up = new Cesium.Cartesian3(0, 0, 10)
  const right = Cesium.Cartesian3.subtract(p2C3, p1C3, new Cesium.Cartesian3())
  let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
  normal = Cesium.Cartesian3.normalize(normal, normal)
  const planeTmp = Cesium.Plane.fromPointNormal(p1C3, normal)
  return Cesium.ClippingPlane.fromPlane(planeTmp)
}

/**
 * @description: 转换矩阵
 * @param {*} tileset
 * @return {*}
 */
export function getInverseTransform (tileset) {
  let transform
  const tmp = tileset.root.transform
  if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
    transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center)
  } else {
    transform = Cesium.Matrix4.fromArray(tileset.root.transform)
  }
  return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
}