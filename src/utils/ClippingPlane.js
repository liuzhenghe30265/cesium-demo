/* eslint-disable no-undef */
import * as turf from '@turf/turf'

export function createPlaneUpdateFunction (plane) {
  return function () {
    return plane
  }
}

/**
 * @description: 给模型添加切割面
 * @param {*} url 模型地址
 * @param {*} maximumScreenSpaceError 驱动细节细化程度的最大屏幕空间错误
 * @param {*} clippingPlanes 切割面
 * @param {*} material 材质
 * @param {*} outline 边框
 * @param {*} outlineColor 边框颜色
 * @return {*}
 */
export function createClippingPlaneFun (url, clippingPlanes) {
  const planeEntities = []
  const option = {
    url: url,
    maximumScreenSpaceError: 8,
    clippingPlanes: clippingPlanes
  }
  const tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset(option)
  )

  tileset.readyPromise.then(function (tileset) {
    const boundingSphere = tileset.boundingSphere
    const radius = boundingSphere.radius
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

      for (let i = 0; i < clippingPlanes.length; ++i) {
        const plane = clippingPlanes.get(i)
        const planeEntity = viewer.entities.add({
          position: boundingSphere.center,
          plane: {
            dimensions: new Cesium.Cartesian2(
              radius,
              radius
            ),
            material: Cesium.Color.RED.withAlpha(0.0),
            plane: new Cesium.CallbackProperty(
              createPlaneUpdateFunction(plane),
              false
            ),
            outline: false,
            outlineColor: Cesium.Color.RED
          }
        })
        planeEntities.push(planeEntity)
      }
      return tileset
    }
  })
  return tileset
}

export function isDirRes (polygon, isClockwise) {
  var lineStringList = []
  polygon.forEach((p) => {
    lineStringList.push([p.lng, p.lat])
  })

  var clockwiseRing = turf.lineString(lineStringList)
  const isR = turf.booleanClockwise(clockwiseRing)

  var points = []
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
  const val = Cesium.Cartesian3.fromDegrees(point.lng, point.lat)
  return Cesium.Matrix4.multiplyByPoint(
    inverseTransform, val, new Cesium.Cartesian3(0, 0, 0))
}
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

export function getInverseTransform (tileSet) {
  let transform
  const tmp = tileSet.root.transform
  if ((tmp && tmp.equals(Cesium.Matrix4.IDENTITY)) || !tmp) {
    transform = Cesium.Transforms.eastNorthUpToFixedFrame(tileSet.boundingSphere.center)
  } else {
    transform = Cesium.Matrix4.fromArray(tileSet.root.transform)
  }
  return Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())
}