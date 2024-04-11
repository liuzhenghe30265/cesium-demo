/* eslint-disable new-cap */
/* eslint-disable no-undef */

import * as turf from '@turf/turf'

var safedis = 6 // 安全距离
var times = 0
var excludeArr = null
const straightLine = false // 走直线

// 获取当前镜头位置
function getCameraPosition() {
    const cameraPosition = viewer.camera.positionCartographic
    const direction = [
        viewer.camera.heading * (180 / Math.PI),
        viewer.camera.pitch * (180 / Math.PI),
        viewer.camera.roll * (180 / Math.PI)
    ]
    return {
        longitude: Cesium.Math.toDegrees(cameraPosition.longitude),
        latitude: Cesium.Math.toDegrees(cameraPosition.latitude),
        altitude: cameraPosition.height,
        direction
    }
}

var getLonAndLat = function (lng, lat, brng, dist) {
    /**
     * 根据一个经纬度及距离角度，算出另外一个经纬度
     * @param {*} lng 经度 113.3960698
     * @param {*} lat 纬度 22.941386
     * @param {*} brng 方位角 45 ---- 正北方：000°或360° 正东方：090° 正南方：180° 正西方：270°
     * @param {*} dist 90000距离(米)
     *
     */
    function rad(d) {
        return d * Math.PI / 180.0
    }

    /**
     * 弧度换成度
     * @param  {Float} x 弧度
     * @return {Float}   度
     */
    function deg(x) {
        return x * 180 / Math.PI
    }
    // 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
    var a = 6378137
    var b = 6356752.3142
    var f = 1 / 298.257223563

    var lon1 = lng * 1
    var lat1 = lat * 1
    var s = dist
    var alpha1 = rad(brng)
    var sinAlpha1 = Math.sin(alpha1)
    var cosAlpha1 = Math.cos(alpha1)

    var tanU1 = (1 - f) * Math.tan(rad(lat1))
    var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1))
    var sinU1 = tanU1 * cosU1
    var sigma1 = Math.atan2(tanU1, cosAlpha1)
    var sinAlpha = cosU1 * sinAlpha1
    var cosSqAlpha = 1 - sinAlpha * sinAlpha
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b)
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

    var sigma = s / (b * A)
    var sigmaP = 2 * Math.PI
    while (Math.abs(sigma - sigmaP) > 1e-12) {
        var cos2SigmaM = Math.cos(2 * sigma1 + sigma)
        var sinSigma = Math.sin(sigma)
        var cosSigma = Math.cos(sigma)
        var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)))
        sigmaP = sigma
        sigma = s / (b * A) + deltaSigma
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
    var lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp))
    var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1)
    var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
    var L = lambda - (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

    // var revAz = Math.atan2(sinAlpha, -tmp) // final bearing

    var lngLatObj = { lng: lon1 + deg(L), lat: deg(lat2) }
    return lngLatObj
}

/**
 * 获取相交对象
 * @param {*} startPos
 * @param {*} endPos
 * @param {*} excludeArr
 * @param {*} bDrillPick
 */
function _getIntersectObj(startPos, endPos, excludeArr = viewer.entities.values.filter(item => item.name === 'waypoint' || item.name === '虎鲸'), bDrillPick = false) {
    try {
        // console.time('ray')
        // return []
        var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPos, startPos, new Cesium.Cartesian3()), new Cesium.Cartesian3())
        // if($vueSelf.$viewed.vishedfrustum)
        // excludeArr = excludeArr.push($vueSelf.$viewed.vishedfrustum)
        var ray = new Cesium.Ray(startPos, direction) // 无限延长的射线
        var results = []
        if (bDrillPick) {
            results = viewer.scene.drillPickFromRay(ray, 2, excludeArr)
        } else {
            // 只pick首个物体
            var result = viewer.scene.pickFromRay(ray, excludeArr)
            if (Cesium.defined(result)) {
                results = [result]
            }
        }
        const distance = Cesium.Cartesian3.distance(endPos, startPos)
        if (results.length > 0) { Cesium.Cartesian3.distance(results[0].position, startPos) > distance ? results = [] : '' }
        // console.timeEnd('ray')
        return results
    } catch (error) {
        return [null]
    }
}

/**
 * 环绕360检测是否安全
 * @param {*} start
 * @param {*} lng
 * @param {*} lat
 * @param {*} bearing
 * @param {*} offsetHeight
 * @returns
 */
async function loopAngle(start, lng, lat, bearing, offsetHeight) {
    let result = null
    for (var i = bearing; i < bearing + 360; i += 20) {
        // result =  turf.destination(turf.point([lng,lat]), 0.01, i)
        // 计算拍照点位
        const dist = safedis + 1
        result = getLonAndLat(lng, lat, i, dist)
        console.log('.............result', result)
        // console.log('.............result2', turf.rhumbDestination(
        //     turf.point([lng, lat]),
        //     dist,
        //     i
        // ).geometry.coordinates)
        result.bearing = i
        // 点位是否可以拍摄到点位
        const inter = _getIntersectObj(start, new Cesium.Cartesian3.fromDegrees(result.lng, result.lat, offsetHeight), excludeArr)
        if (inter.length === 0) {
            // 检测拍照点是否安全
            if (await aroundInter(result.lng, result.lat, offsetHeight)) {
                break
            }
        }

        result = null
    }
    return result
}

/**
 * 检测拍照点是否安全
 * @param {*} lng
 * @param {*} lat
 * @param {*} height
 * @returns
 */
async function aroundInter(lng, lat, height) {
    let result = null
    let yes = true
    let inter = null
    const cubeArray = []
    const safedisDis = safedis
    // 根据点位球形计算有没有遮挡，有遮挡则不安全。
    /**
     *
     *
     *
     *      1 _________2
     *       /|       /|
     *    0 /________/ |
     *      | |      |3|
     *      | | _____|_|
     *      | /      | /
     *      |/_______|/

     *
          1 _________2
           /        /
         0/________/3
     */
    for (let index = -135; index <= 135; index += 90) {
        result = getLonAndLat(lng, lat, index, safedisDis)
        cubeArray.push(result)
    }
    for (let index = 0; index < cubeArray.length; index++) {
        const element = cubeArray[index]
        if (index === 0) {
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[2].lng, cubeArray[2].lat, height + safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[1].lng, cubeArray[1].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[3].lng, cubeArray[3].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
        } else if (index === 1) {
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[3].lng, cubeArray[3].lat, height + safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[3].lng, cubeArray[3].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[0].lng, cubeArray[0].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[2].lng, cubeArray[2].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
        } else if (index === 2) {
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[1].lng, cubeArray[1].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[3].lng, cubeArray[3].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height - safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[0].lng, cubeArray[0].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
        } else if (index === 3) {
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[2].lng, cubeArray[2].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height + safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[0].lng, cubeArray[0].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
            inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(element.lng, element.lat, height - safedis), new Cesium.Cartesian3.fromDegrees(cubeArray[1].lng, cubeArray[1].lat, height - safedis), excludeArr)
            if (inter.length > 0) {
                yes = false
                break
            }
        }
    }
    return yes
}

/**
 *
 * 判断航线是否安全
 * @param {*} sLng 起点经度
 * @param {*} sLat 起点纬度
 * @param {*} eLng 终点经度
 * @param {*} eLat 终点纬度
 * @param {*} offset 高度偏移
 * @returns 安全点角度
 */
export function safeRectTest(sLng, sLat, sAlt, eLng, eLat, eAlt) {
    const inter = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(sLng, sLat, sAlt), new Cesium.Cartesian3.fromDegrees(eLng, eLat, eAlt), excludeArr)
    let flag = false
    if (inter.length === 0) {
        flag = true
    }
    var status = true
    var bear = null
    if (flag) {
        /**
         * 该点与起飞点连射线，无遮挡时，判断两点周围10m一圈射线，如果都无遮挡视为安全航线
         *
         */
        const point1 = turf.point([sLng, sLat])
        const point2 = turf.point([eLng, eLat])
        const bearing = turf.bearing(point1, point2) // 计算两点角度
        const bear1 = bearing - 90
        const bear2 = bearing + 90
        const result1 = tool.getLonAndLat(sLng, sLat, bear1, safedis)
        const result2 = tool.getLonAndLat(eLng, eLat, bear1, safedis)
        const result3 = tool.getLonAndLat(sLng, sLat, bear2, safedis)
        const result4 = tool.getLonAndLat(eLng, eLat, bear2, safedis)
        let inter = null

        let cubeArray = []

        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result1.lng, result1.lat, sAlt + safedis)) // 0
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result1.lng, result1.lat, sAlt - safedis)) // 1
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result3.lng, result3.lat, sAlt + safedis)) // 2
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result3.lng, result3.lat, sAlt - safedis)) // 3
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result2.lng, result2.lat, eAlt + safedis)) // 4
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result2.lng, result2.lat, eAlt - safedis)) // 5
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result4.lng, result4.lat, eAlt + safedis)) // 6
        cubeArray.push(new Cesium.Cartesian3.fromDegrees(result4.lng, result4.lat, eAlt - safedis)) // 7

        /**
    *
    *
    *
    *      0 ____8____2
    *       /|       /|
    *    1 /____9___/ |
    *      | |      |3|
    *      | | _10__|_|
    *      | /4     | /6
    *      |/___11__|/
        5         7

    */
        for (let i = 0; i < cubeArray.length; i++) {
            const element = cubeArray[i]
            if (i === 0) {
                inter = _getIntersectObj(element, cubeArray[3], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
                inter = _getIntersectObj(element, cubeArray[6], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
            } else if (i === 1) {
                inter = _getIntersectObj(element, cubeArray[7], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
                inter = _getIntersectObj(element, cubeArray[2], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
            } else if (i === 2) {
                inter = _getIntersectObj(element, cubeArray[4], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
                inter = _getIntersectObj(element, cubeArray[7], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
            } else if (i === 3) {
                inter = _getIntersectObj(element, cubeArray[5], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
                inter = _getIntersectObj(element, cubeArray[6], excludeArr)
                if (inter.length > 0) {
                    status = false
                    break
                }
            } else {
                break
            }
        }
        if (status) bear = bearing
        cubeArray = null
    }
    return bear
}

/**
 * 计算安全路径
 * @param {*} longitude
 * @param {*} latitude
 * @param {*} height
 * @returns
 */
export function startPosition(longitude, latitude, height, devicePosition, isDevicePosition) {
    // 飞机不再飞选择机库位起始点，飞机在飞选择飞机为起始点
    var lng = devicePosition.lng
    var lat = devicePosition.lat
    var alt = devicePosition.alt
    var arr = []

    // const prevCompute = _getIntersectObj(new Cesium.Cartesian3.fromDegrees(lng, lat, alt), new Cesium.Cartesian3.fromDegrees(longitude, latitude, height), undefined)
    const prevCompute = safeRectTest(lng, lat, alt, longitude, latitude, height)
    // .filter(item => {
    //     return item && item.object && item.object.primitive && Cesium.defined(item.object.primitive) && item.object.primitive.constructor !== Cesium.Label
    // })
    const altitude = Math.max(alt, height)
    console.log(',,,,,,,,,@#prev-c', prevCompute, isDevicePosition)

    if (!prevCompute || isDevicePosition) {
        for (let index = 0; index < 1000; index += 3) {
            const offset = altitude + index
            var bearing = safeRectTest(lng, lat, offset, longitude, latitude, offset)
            // for (let angle = 1; angle < 90; angle += 5) {

            //         console.log(times++)

            //     status = circleRay({
            //         lng: lng,
            //         lat: lat
            //     }, {
            //         lng: longitude,
            //         lat: latitude
            //     }, offset, bear1, angle)
            //     if (!status) break;
            //     status = circleRay({
            //         lng: lng,
            //         lat: lat
            //     }, {
            //         lng: longitude,
            //         lat: latitude
            //     }, offset, bear2, angle)
            //     if (!status) break;
            // }
            if (bearing) {
                arr.push({
                    longitude: lng,
                    latitude: lat,
                    altitude: offset,
                    bear: bearing < 0 ? bearing + 360 : bearing
                })
                if (index !== 0) {
                    arr.push({
                        longitude: longitude,
                        latitude: latitude,
                        altitude: offset,
                        bear: bearing < 0 ? bearing + 360 : bearing
                    })
                    var inters = safeRectTest(lng, lat, alt, longitude, latitude, offset)
                    console.log(inters)
                    if (inters) arr[0].altitude = alt
                }
                break
            }
        }
    }

    return arr
}

export async function GetAutoWaypoint(startPosition) {
    // const startPosition = {
    //     longitude: 117.71471225585701,
    //     latitude: 39.07840134429747,
    //     altitude: 20.528733786993396
    // }
    const start = new Cesium.Cartesian3.fromDegrees(startPosition.longitude, startPosition.latitude, startPosition.altitude)
    // const end = {
    //     longitude: 117.7150416424487,
    //     latitude: 39.0787681478651,
    //     altitude: 71.84498200787097,
    //     direction: [
    //         209.20390744351795,
    //         -48.43749360745798,
    //         0.00006367215050849046
    //     ]
    // }
    const end = getCameraPosition()
    const devicePosition = {
        lng: 117.7133686,
        lat: 39.0772622,
        alt: 8.5
    }

    viewer.entities.add({
        position: start,
        label: {
            text: 'start'
        }
    })
    viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(end.longitude, end.latitude, end.altitude),
        label: {
            text: 'end'
        }
    })
    viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(devicePosition.lng, devicePosition.lat, devicePosition.alt),
        label: {
            text: 'device'
        }
    })
    var cartographic = Cesium.Cartographic.fromCartesian(start, viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
    var lat = Cesium.Math.toDegrees(cartographic.latitude)
    var lng = Cesium.Math.toDegrees(cartographic.longitude)
    var height = cartographic.height
    let result = null
    var point1 = turf.point([lng, lat])
    var point2 = turf.point([end.longitude, end.latitude])

    var bearing = turf.bearing(point1, point2) // 当前镜头与目标位角度 bearing 函数计算两个点之间的方位角度，即当前镜头与目标位置之间的夹角。
    let angle = 45
    let offsetHeight = height + (Math.tan(angle * Math.PI / 180.0) * safedis)
    // 45度往上寻找拍照点
    for (let index = 35; index < 90; index += 14) {
        angle = index
        offsetHeight = height + (Math.tan(index * Math.PI / 180.0) * (safedis + 4))
        // 环绕360循环当前拍照角度是否ok
        result = await loopAngle(start, lng, lat, bearing, offsetHeight)
        if (result) {
            break
        }
    }
    // 45度往上没找到，从40度找到0度
    if (!result) {
        for (let index = 30; index > 0; index -= 10) {
            angle = index
            offsetHeight = height + (Math.tan(index * Math.PI / 180.0) * (safedis + 4))
            // 环绕360循环当前拍照角度是否ok
            result = await loopAngle(start, lng, lat, bearing, offsetHeight)
            if (result) {
                break
            }
        }
    }
    if (!result) {
        alert('此地无法飞行')
        return null
    }
    console.log('................result', result)
    viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(result.lng, result.lat, offsetHeight),
        label: {
            text: 'result'
        }
    })
    let points = []
    points = points.concat(startPosition(result.lng, result.lat, offsetHeight, devicePosition, false).map((item, index) => {
        return {
            action: [],
            longitude: item.longitude,
            latitude: item.latitude,
            altitude: item.altitude,
            direction: item.bear,
            lineId: '',
            pointId: 0,
            propertyType: 0,
            routeName: ``,
            routeType: 11,
            singleType: 0,
            speed: 10,
            turnType: 1,
            routeId: 0,
            index: index + 1
        }
    }))
    if (straightLine) {
        var inters = safeRectTest(points[0].longitude, points[0].latitude, devicePosition.alt, result.lng, result.lat, offsetHeight)
        if (inters) points[0].altitude = devicePosition.alt
    }

    points = points.concat([{
        longitude: result.lng,
        latitude: result.lat,
        altitude: offsetHeight,
        direction: result.bearing > 180 ? result.bearing - 180 : result.bearing + 180,
        lineId: '',
        pointId: 0,
        propertyType: 0,
        routeName: '',
        routeType: 11,
        singleType: 0,
        speed: 10,
        turnType: 1,
        index: points.length + 1,
        routeId: 0,
        droneActionType: 1, // 悬停
        action: [{
            action: 1,
            actionIndex: 1,
            name: '',
            pitch: angle,
            post_time: 1000,
            pre_time: 1000,
            roll: 0,
            yaw: 0,
            zoom: 1,
            targetType: 3
        }]
    }])
    excludeArr = null
    return points
}