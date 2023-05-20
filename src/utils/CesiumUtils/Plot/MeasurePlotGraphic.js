// 测量标绘图形处理

import {
    // GetCameraPositionInfo,
    // PositionIsLegal,
    // GetMouseEarthPosition,
    // cartesianToLongAndLat
} from '../common'
import {
    FormatGraphicLabelText
} from './common'

export default class MeasurePlotGraphic {
    /**
     * @param {*}
     * @memberof MeasurePlotGraphic
     */
    constructor(options) {
        this.baseEntity = null
        this.colorValue = '#ffffff'
        this.addBaseEntity()
        if (options.defaultColorValue) {
            this.colorValue = options.defaultColorValue
        }
    }

    addPolygon(data) {
        const { activeShapeComputed, centerPoint, verticesPosition, activeShapePoints } = data
        const polygonColor = Cesium.Color.fromCssColorString(this.colorValue)
        const vertices = verticesPosition || activeShapePoints || []
        const _hierarchy = []
        if (vertices.length > 0) {
            for (let index = 0; index < vertices.length; index++) {
                const point = vertices[index]
                _hierarchy.push(Cesium.Cartesian3.fromDegrees(
                    point.longitude,
                    point.latitude,
                    point.altitude
                ))
            }
        }
        const dynamicPositions = new Cesium.CallbackProperty(function () {
            return new Cesium.PolygonHierarchy(_hierarchy)
        }, false) // 使贴地多边形在模型上有立体效果
        const altitudes = vertices.map(_ => _.altitude)
        const max = altitudes.sort()[altitudes.length - 1]
        centerPoint.altitude = max

        const label = FormatGraphicLabelText('polygon', {
            value: activeShapeComputed
        })
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(centerPoint.longitude, centerPoint.latitude, centerPoint.altitude),
            parent: this.baseEntity,
            polygon: {
                hierarchy: dynamicPositions,
                material: new Cesium.ColorMaterialProperty(
                    polygonColor
                )
            },
            label: {
                text: label,
                font: '30px sans-serif',
                fillColor: Cesium.Color.fromCssColorString('#fff'),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.fromCssColorString('#000'),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10000.0),
                scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
            }
        })
    }

    addPolyline(data) {
        const { activeShapeComputed, centerPoint, activeSubLine } = data
        const _polylineColor = Cesium.Color.fromCssColorString(this.colorValue)

        const totalLabel = FormatGraphicLabelText('polyline', {
            value: activeShapeComputed
        })
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(centerPoint.longitude, centerPoint.latitude, centerPoint.altitude),
            parent: this.baseEntity,
            label: {
                text: totalLabel,
                font: '30px sans-serif',
                fillColor: Cesium.Color.fromCssColorString('#fff'),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.fromCssColorString('#000'),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
                scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
            }
        })

        if (activeSubLine && activeSubLine.length > 0) {
            for (let index = 0; index < activeSubLine.length; index++) {
                const line = activeSubLine[index]
                const positions = Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        line.start.longitude, line.start.latitude, line.start.altitude,
                        line.end.longitude, line.end.latitude, line.end.altitude
                    ]
                )
                const _text = FormatGraphicLabelText('polyline', {
                    subValue: line.distance
                })
                viewer.entities.add({
                    parent: this.baseEntity,
                    position: Cesium.Cartesian3.fromDegrees(line.centerPoint.longitude, line.centerPoint.latitude, line.centerPoint.altitude),
                    polyline: {
                        positions: positions,
                        material: _polylineColor,
                        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                            _polylineColor
                        }),
                        width: 5
                    },
                    label: {
                        text: _text,
                        font: '30px sans-serif',
                        fillColor: Cesium.Color.fromCssColorString('#fff'),
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        outlineColor: Cesium.Color.fromCssColorString('#000'),
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
                        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
                    }
                })
            }
        }
    }

    addPoint(data) {
        const { centerPoint } = data
        const pointColor = Cesium.Color.fromCssColorString(this.colorValue)
        const label = FormatGraphicLabelText('point', centerPoint)
        const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(centerPoint.longitude, centerPoint.latitude, centerPoint.altitude),
            parent: this.baseEntity,
            point: {
                color: pointColor,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
                scaleByDistance: new Cesium.NearFarScalar(1.0e2, 1.0, 0.7e4, 0.8),
                pixelSize: 14,
                outlineWidth: 2,
                outlineColor: Cesium.Color.fromCssColorString('#fff')
            },
            label: {
                text: label,
                font: '30px sans-serif',
                pixelOffset: new Cesium.Cartesian2(0.0, 40.0),
                fillColor: Cesium.Color.fromCssColorString('#fff'),
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.fromCssColorString('#000'),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
                scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5)
            }
        })
        return entity
    }

    addBaseEntity() {
        viewer.entities.remove(this.baseEntity)
        this.baseEntity = new Cesium.Entity({
            show: true
        })
        viewer.entities.add(this.baseEntity)
    }

    ClearGraphic() {
        if (this.baseEntity) {
            if (this.baseEntity._children && this.baseEntity._children.length > 0) {
                const list = this.baseEntity._children
                for (let index = 0; index < list.length; index++) {
                    const entity = list[index]
                    viewer.entities.remove(entity)
                }
            }
            viewer.entities.remove(this.baseEntity)
        }
    }

    AddGraphic(data) {
        if (!data) return
        if (data.drawingMode === 'point') {
            this.addPoint(data)
        } else if (data.drawingMode === 'polyline') {
            this.addPolyline(data)
        } else if (data.drawingMode === 'polygon') {
            this.addPolygon(data)
        }
    }

    Destory(cb) {
        this.ClearGraphic()
        if (cb) {
            cb()
        }
    }
}
