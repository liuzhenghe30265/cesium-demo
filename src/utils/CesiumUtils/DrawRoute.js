/* eslint-disable new-cap */
/* eslint-disable no-undef */
import {
    // FineBezier,
    PositionIsLegal,
    EqualPosition,
    getTwoPointDistance,
    getTwoPointCenter,
    getHeadingDegByTwoPoints
} from './common'

import { sum } from 'lodash'

const allRoutes = {}
let flyEntity = null

function addBillboardGraphic(BillboardCollection, position, image, color) {
    if (BillboardCollection && BillboardCollection instanceof Cesium.BillboardCollection) {
        BillboardCollection.add({
            position: Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.altitude
            ),
            image: image,
            color: color,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scale: 0.8,
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 12000.0)
        })
    }
}

function addLabelGraphic(LabelCollection, position, text, options) {
    if (LabelCollection && LabelCollection instanceof Cesium.LabelCollection) {
        LabelCollection.add({
            position: Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.altitude
            ),
            text: text,
            // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            // fillColor: new Cesium.Color.fromCssColorString('#fcb718'),
            // outlineColor: new Cesium.Color.fromCssColorString('#fcb718'),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: options.fillColor || new Cesium.Color.fromCssColorString('#fff'),
            outlineColor: options.outlineColor || new Cesium.Color.fromCssColorString('#333'),
            outlineWidth: options.outlineWidth || 1,
            pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0.0, 0.0),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            showBackground: options.showBackground,
            backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.6),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.5, 0.5e4, 0.2),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 12000.0)
        })
    }
}

// function addPolylineEntity(collection, positions, color) {
//     const entity = viewer.entities.add(
//         new Cesium.Entity({
//             polyline: {
//                 positions: positions,
//                 width: 4,
//                 arcType: Cesium.ArcType.GEODESIC,
//                 material: new Cesium.PolylineDashMaterialProperty({
//                     color: color || new Cesium.Color.fromCssColorString('#FCB718'),
//                 }),
//                 scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.5, 0.7e4, 0.2),
//                 distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
//                     0.0,
//                     7000.0
//                 )
//             }
//         })
//     )
//     collection.push(entity)
// }

function addPolylineInstance(PolylineGeometryPrimitive, positions) {
    const GeometryInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
            positions: positions,
            width: 2,
            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
        }),
        attributes: {
            distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, 7000.0)
        }
    })
    PolylineGeometryPrimitive.geometryInstances.push(GeometryInstance)
}

function addPolylineGraphic(PolylineCollection, positions, color, lineType) {
    if (PolylineCollection && PolylineCollection instanceof Cesium.PolylineCollection) {
        const _material = lineType && lineType === 'solid'
            ? Cesium.Material.fromType('Color', {
                color: Cesium.Color.fromCssColorString('#FCB718')
            })
            : Cesium.Material.fromType('PolylineDash', {
                color: color || Cesium.Color.fromCssColorString('#FCB718'), // 行的颜色
                // gapColor: Cesium.Color.fromCssColorString('#0000ff'), // 行的间隙的颜色
                dashLength: 10, // 虚线长度
                // dashPattern: parseInt('110000001111', 2) // 该行的16位点画样式
            })
        const _width = lineType && lineType === 'solid' ? 1.5 : 2.5
        PolylineCollection.add({
            positions: positions,
            width: _width,
            material: _material,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 12000.0),
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
        })
    }
}

function clearFlyEntity() {
    if (flyEntity && flyEntity instanceof Cesium.Entity) {
        viewer.entities.remove(flyEntity)
    }
}

function createFlyEntity(positions) {
    clearFlyEntity()
    flyEntity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], positions[2]),
        point: new Cesium.PointGraphics({
            pixelSize: 40,
            color: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0),
        }),
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
            material: new Cesium.PolylineDashMaterialProperty({
                color: new Cesium.Color.fromCssColorString('#fff').withAlpha(0.0)
            })
        }
    })
    viewer.flyTo(flyEntity, {
        duration: 1,
    })
}

/**
 * @description: 通过航点列表计算航程
 * @param {*} list
 * @param {*} distanceTotal
 * @param {*} baseHeight（此处为设备的高）
 * @return {*}
 */
function computedVoyageByWayPoint(list, distanceTotal, baseHeight) {
    const _baseHeight = baseHeight || 0
    let time = 0
    let point_cnt = 0
    list.map((point, index) => {
        const cur_point = [
            parseFloat(point['longitude']) * 1.0,
            parseFloat(point['latitude']) * 1.0,
            parseFloat(point['altitude']) * 1.0
        ]
        if (point_cnt > 0) {
            if (point.action && point.action.length > 0) {
                point.action.map(action => {
                    if (parseFloat(action.camAction) !== 1 && parseFloat(action.camAction) !== 2) {
                        time += 5
                    } else {
                        time += 30
                    }
                })
            }
        }
        if (index === list.length - 1 && index !== 0) {
            time += distanceTotal / 7
            time += (cur_point[2] - _baseHeight) * 2 / 7
            time += time * 0.1
        }
        point_cnt++
    })
    return time
    // return (time / 60).toFixed(2)
}

/**
 * @description: 计算拍照数量
 * @param {*} list
 * @param {*} distanceTotal
 * @param {*} planeTime
 * @return {*}
 */
function computedPhotoCount(list, distanceTotal, planeTime) {
    let count = 0
    for (let index = 0; index < list.length; index++) {
        const point = list[index]
        if (!point || !point.action || !point.action.length) {
            return
        }
        for (let pointIndex = 0; pointIndex < point.action.length; pointIndex++) {
            const action = point.action[pointIndex]
            if (action.swingSeq && action.swingSeq > -1) {
                // 摆拍模式
                const _num = sum(action.swingSeq.toString(2).split('').map(_ => parseInt(_)))
                count += _num
            } else if (action.action === 1 || action.action === 2) {
                // 拍一张或拍三张
                const _num = action.action === 2 ? 3 : 1
                count += _num
            } else if (action.action === 3) {
                // 等时间拍照
                count = parseInt((planeTime * 1000) / action.intervalTime)
            } else if (action.action === 4) {
                // 等距离拍照
                count = parseInt(distanceTotal / action.intervalDistance)
            }
        }
    }
    return count
}

function handleRouteData(list, status) {
    const fList = list.filter(
        _ => PositionIsLegal(_)
    )

    // 处理 heading === -2 的航点（机头朝向下一个航点）
    for (let index = 0; index < list.length; index++) {
        const element1 = list[index]
        if (element1 && element1.heading === -2) {
            const element2 = list[index + 1]
            if (element2) {
                element1.heading = parseFloat(getHeadingDegByTwoPoints(element1, element2).toFixed(2))
            }
        }
    }

    let result = []
    // const tempArr = []
    // 按需取航点数据
    const _list = fList.map((_, index) => {
        return {
            index: index + 1,
            code: _.code,
            routeId: _.routeId,
            waypointType: _.waypointType,
            latitude: parseFloat(_.latitude),
            longitude: parseFloat(_.longitude),
            altitude: parseFloat(_.altitude),
            heading: parseFloat(_.heading),
            action: _.actionEntityList || _.action || [], // way_point 接口返回的动作在 actionEntityList 中
            // action: _.action || [], // tower/route 接口返回的动作在 action 中
            turnType: _.turnType
        }
    })
    if (status) {
        // 归类（存在一个问题，因为归类了实体是一个，所以编辑时通过 id 可能找不到实体）
        // for (let i = 0; i < _list.length; i++) {
        //     if (tempArr.findIndex(
        //         _ => _.longitude === _list[i].longitude &&
        //             _.latitude === _list[i].latitude &&
        //             _.altitude === _list[i].altitude
        //     )
        //     ) {
        //         result.push({
        //             index: _list[i].index,
        //             longitude: _list[i].longitude,
        //             latitude: _list[i].latitude,
        //             altitude: _list[i].altitude,
        //             collection: [_list[i]]
        //         })
        //         tempArr.push(_list[i])
        //     } else {
        //         for (let j = 0; j < result.length; j++) {
        //             if (EqualPosition(result[j], _list[i])) {
        //                 // 坐标一样，归类
        //                 result[j].collection.push(_list[i])
        //                 break
        //             }
        //         }
        //     }
        // }
    } else {
        result = _list
    }
    return result
}

export function GetRouteGraphicData(id) {
    if (id && allRoutes[id]) {
        return allRoutes[id]
    } else {
        return allRoutes
    }
}

export function RouteGraphicVisible(id, status) {
    if (!id) return
    if (id === 'all') {
        for (const key in allRoutes) {
            if (Object.hasOwnProperty.call(allRoutes, key)) {
                const item = allRoutes[key]
                if (item) {
                    item.BillboardCollection.show = status
                    item.LabelCollection.show = status
                    item.PolylineCollection.show = status
                    item.PolylineGeometryPrimitive.show = status
                }
            }
        }
    } else if (allRoutes[id]) {
        if (allRoutes[id]) {
            const data = allRoutes[id]
            data.BillboardCollection.show = status
            data.LabelCollection.show = status
            data.PolylineCollection.show = status
            data.PolylineGeometryPrimitive.show = status
        }
    }
}

export function AddRouteGraphic(options) {
    if (allRoutes[options.id]) return
    let planeTime = 0
    let totalDistance = 0
    let photoCount = 0
    const _positions = [] // 折线顶点
    if (!options.list || options.list.length < 1) return

    const firstPoint = options.list[0]
    if (!PositionIsLegal({
        longitude: parseFloat(firstPoint.longitude),
        latitude: parseFloat(firstPoint.latitude),
        altitude: parseFloat(firstPoint.altitude),
    })) return

    const _list = handleRouteData(options.list, false) // 经过处理的航点数据（坐标一致的归为一个航点，heading === -2 朝向下一个航点）
    if (!_list || _list.length < 1) return
    options.list = _list

    // 航线
    const collectionID = `${options.id}_routeGraphic`
    options.PolylineCollection = new Cesium.PolylineCollection()
    options.PolylineCollection.id = collectionID
    viewer.scene.primitives.add(options.PolylineCollection)
    options.PolylineEntities = []

    // 标注文字
    options.LabelCollection = new Cesium.LabelCollection()
    options.LabelCollection.id = collectionID
    viewer.scene.primitives.add(options.LabelCollection)

    // 航点图标
    options.BillboardCollection = new Cesium.BillboardCollection()
    options.BillboardCollection.id = collectionID
    viewer.scene.primitives.add(options.BillboardCollection)

    allRoutes[options.id] = options
    const currentRoute = allRoutes[options.id]

    const routeColor = currentRoute.color ? Cesium.Color.fromCssColorString(currentRoute.color) : Cesium.Color.fromCssColorString('#FCB718')

    // 航线（primitive）
    options.PolylineGeometryPrimitive = new Cesium.Primitive({
        geometryInstances: [],
        appearance: new Cesium.PolylineMaterialAppearance({
            flat: true,
            // material: Cesium.Material.fromType('Color')
            material: new Cesium.Material({
                fabric: {
                    type: 'Color',
                    uniforms: {
                        color: routeColor
                    }
                }
            })
        })
    })
    options.PolylineGeometryPrimitive.id = collectionID
    viewer.scene.primitives.add(options.PolylineGeometryPrimitive)

    for (let index = 0; index < _list.length; index++) {
        const point = _list[index]
        point.longitude = parseFloat(point.longitude)
        point.latitude = parseFloat(point.latitude)
        point.altitude = parseFloat(point.altitude)
        point.heading = parseFloat(point.heading) || -2

        _positions.push(point.longitude)
        _positions.push(point.latitude)
        _positions.push(point.altitude)

        let pointLabel = ''
        if (point.collection && point.collection.length > 0) {
            // 一个位置存在多个点
            pointLabel = point.collection.map(_ => _.index).join('\n')
        } else if (index === 0 || (options.endIcon && index === _list.length - 1)) {
            // 起始点有图标，不显示序号
            pointLabel = ''
        } else {
            if (currentRoute.indexReverse) {
                pointLabel = `${_list.length - index}`
            } else {
                pointLabel = `${index + 1}`
            }
        }

        let _image = currentRoute.image || require('@/assets/images/controls/routePlanning/point.png')
        // let _image = currentRoute.image || require('@/assets/images/controls/routePlanning/pointn3.png')
        let waypointColor = currentRoute.color ? Cesium.Color.fromCssColorString(currentRoute.color) : new Cesium.Color.fromCssColorString('#fff')
        if (point.turnType === 2) {
            _image = require('@/assets/images/controls/routePlanning/point_w.png')
            waypointColor = new Cesium.Color.fromCssColorString('#fff')
        }
        if (index === 0) {
            // 起飞点/返航点
            _image = require('@/assets/images/controls/routePlanning/start0.png')
            waypointColor = new Cesium.Color.fromCssColorString('#fff')
        } else if (index === _list.length - 1) {
            if (options.endIcon) {
                _image = require('@/assets/images/controls/routePlanning/end0.png')
                waypointColor = new Cesium.Color.fromCssColorString('#fff')
            }
            const _start = _list[0]
            const _end = _list[_list.length - 1]
            if (EqualPosition(_start, _end)) {
                // 起始点在同一位置，使用相同图标
                _image = require('@/assets/images/controls/routePlanning/start0.png')
                waypointColor = new Cesium.Color.fromCssColorString('#fff')
                pointLabel = ''
            }
        }

        const point2 = _list[index + 1]
        if (point && point2) {
            if (currentRoute.lineVisible) {
                const normalPositions = Cesium.Cartesian3.fromDegreesArrayHeights([point.longitude, point.latitude, point.altitude, point2.longitude, point2.latitude, point2.altitude])
                if (currentRoute.polylineGeometry) {
                    // 解决高分辨率设备折线显示异常问题
                    addPolylineInstance(currentRoute.PolylineGeometryPrimitive, normalPositions, routeColor, currentRoute.lineType)
                } else {
                    addPolylineGraphic(currentRoute.PolylineCollection, normalPositions, routeColor, currentRoute.lineType)
                }
            }

            if (currentRoute.distanceVisible) {
                const _distance = getTwoPointDistance(point, point2)
                if (_distance > 0) {
                    totalDistance += _distance
                    const _center = getTwoPointCenter(point, point2)
                    // 线段距离标注
                    addLabelGraphic(
                        currentRoute.LabelCollection,
                        _center,
                        `${_distance}m`,
                        {
                            showBackground: true,
                            fillColor: new Cesium.Color.fromCssColorString('#fff'),
                            outlineColor: new Cesium.Color.fromCssColorString('#333')
                        }
                    )
                }
            }

            // 贝塞尔曲线
            // if (currentRoute.bezier) {
            //     const bezierList = FineBezier([point, point2])
            //     addPolylineEntity(currentRoute.PolylineEntities, bezierList, routeColor)
            // }

            // 处理 heading === -2 的航点（机头朝向下一个航点）
            // if (point.heading === -2) {
            //     const _heading = parseFloat(getHeadingDegByTwoPoints(point, point2).toFixed(2))
            //     point.heading = _heading
            // }
        }

        if (currentRoute.altitudeVisible) {
            // 海拔标注
            addLabelGraphic(
                currentRoute.LabelCollection,
                point,
                `海拔：${(point.altitude).toFixed(2)}m`,
                {
                    showBackground: true,
                    pixelOffset: new Cesium.Cartesian2(0.0, 30.0),
                    fillColor: new Cesium.Color.fromCssColorString('#fff'),
                    outlineColor: new Cesium.Color.fromCssColorString('#333')
                }
            )
        }

        if (currentRoute.pointVisible) {
            // 航点图标标注
            addBillboardGraphic(currentRoute.BillboardCollection, point, _image, waypointColor)
            // 航点序号标注
            addLabelGraphic(
                currentRoute.LabelCollection,
                point,
                `${pointLabel}`,
                {
                    showBackground: false,
                    // fillColor: point.turnType === 2 ? new Cesium.Color.fromCssColorString('#333') : new Cesium.Color.fromCssColorString('#fff'),
                    fillColor: new Cesium.Color.fromCssColorString('#fff'),
                    outlineColor: point.turnType === 2 ? new Cesium.Color.fromCssColorString('#fff') : new Cesium.Color.fromCssColorString('#333')
                }
            )
        }
    }

    // 航线（绘制单条航线在 ios 存在分辨率问题）
    // if (currentRoute.lineVisible) {
    //     if (currentRoute.bezier) {
    //         // 贝塞尔曲线
    //         const bezierList = FineBezier(list)
    //         const bezierPositions = new Cesium.CallbackProperty(function () {
    //             return bezierList
    //         }, false)
    //         addPolylineEntity(currentRoute.PolylineEntities, bezierPositions, routeColor)
    //     } else {
    //         // 普通航线
    //         const normalPositions = Cesium.Cartesian3.fromDegreesArrayHeights(_positions)
    //         addPolylineGraphic(currentRoute.PolylineCollection, normalPositions, routeColor)
    //     }
    // }

    planeTime = computedVoyageByWayPoint(_list, totalDistance, currentRoute.baseHeight)
    photoCount = computedPhotoCount(_list, totalDistance, planeTime)

    const result = {
        photoCount: photoCount,
        planeTime: parseFloat((planeTime / 60).toFixed(2)),
        totalDistance: parseFloat(totalDistance.toFixed(2))
    }

    // 总航程标注
    if (currentRoute.planeTimeVisible) {
        if (_list.length > 1) {
            const lastPoint = _list[_list.length - 1]
            addLabelGraphic(
                currentRoute.LabelCollection,
                lastPoint,
                `航程：${result.totalDistance}m/${result.planeTime}min`,
                {
                    showBackground: true,
                    pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
                    fillColor: new Cesium.Color.fromCssColorString('#fff'),
                    outlineColor: new Cesium.Color.fromCssColorString('#333')
                }
            )
        }
    }

    if (currentRoute.fly) {
        createFlyEntity(_positions)
    }
    // console.log('...........AddRouteGraphic', options, result, allRoutes)
    return result
}

export function ClearRouteGraphic(id) {
    if (allRoutes[id]) {
        allRoutes[id].PolylineCollection.removeAll()
        viewer.scene.primitives.remove(allRoutes[id].PolylineCollection)
        viewer.scene.primitives.remove(allRoutes[id].PolylineGeometryPrimitive)
        if (allRoutes[id].PolylineEntities && allRoutes[id].PolylineEntities.length > 0) {
            for (let index = 0; index < allRoutes[id].PolylineEntities.length; index++) {
                const entity = allRoutes[id].PolylineEntities[index]
                if (entity) {
                    viewer.entities.remove(entity)
                }
            }
        }
        allRoutes[id].PolylineEntities = []

        allRoutes[id].LabelCollection.removeAll()
        viewer.scene.primitives.remove(allRoutes[id].LabelCollection)

        allRoutes[id].BillboardCollection.removeAll()
        viewer.scene.primitives.remove(allRoutes[id].BillboardCollection)
        delete allRoutes[id]
    }
    clearFlyEntity()
}