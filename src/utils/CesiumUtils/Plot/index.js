// 标绘

import {
  // HandleWGS84ToGCJ02,
  HandleGCJ02ToWGS84,
  GetTerrainPosition,
  ComputeArea4Triangle,
  GetTwoPointDistance,
  GetMouseEarthPosition,
  LongAndLatToWindowPosition,
  makeLineSegment,
  VerticesToLines,
  getSpaceDistance,
  getPolygonArea,
  getPolygonCenterByEntity,
  cartesianToLongAndLat
} from '../common'
import {
  SetEntityPolylinePositions,
  SetEntityPolygonHierarchy,
  SetEntityPolygonMaterial,
  SetEntityPolylineMaterial,
  SetEntityLabelFillColor,
  SetEntityLabelFont,
  SetEntityLabelText,
  SetEntityPosition,
  SetEntityPointPixelSize,
  SetEntityPointColor,
  FormatGraphicLabelText
} from './common'

import { MessageBox, Message } from 'element-ui'

export default class PlotUtil {
  /**
   * @param {*}
   * @memberof PlotUtil
   */
  constructor(options) {
    this.ID = new Date().toLocaleString() // 唯一标识，可同时调用多次绘制工具
    this.drawingMode = 'polygon'
    this.disabledEvent = false // 禁用 event
    this.pointPositionVisible = false // 点标绘显示坐标值
    this.plotName = ''
    this.activeShapePoints = [] // 顶点坐标（多边形的顶点绘制过程中海拔会被置为 0）
    this.activeSubLine = [] // 折线线段信息
    this.verticesPosition = [] // 顶点坐标（绘制时拾取的坐标）
    this.activeShapeComputed = 0 // 多边形是面积，折线是总长
    this.labelFont = '30px sans-serif' // 多边形是面积，折线是总长
    this.colorValue = '#FFFFFF80' // 默认颜色
    this.plotBaseEntity = null
    this.eventHandler = null
    this.activeShape = null // 绘制过程中的图形
    this.floatingPoint = null // 绘制过程中移动的点
    this.areaLabelEntity = null // 总面积
    this.distanceLabelEntities = {} // 线段距离实体集合
    this.vertexEntities = {} // 顶点实体集合
    this.addButtonEntities = {} // 中点添加顶点按钮
    this.totalDistanceLabelEntity = null // 总距离
    this.deleteVertexButtonEntity = null // 删除顶点按钮实体
    this.plotting = false // 绘制中
    this.currentEditPolygonTopPoint = null // 当前编辑多边形顶点的实体
    this.plotTipDOM = null
    this.plotPositionDOM = null
    this.finishPointEntity = null // 移动端结束绘制按钮
    this.overlookStatus = true // true 移动 x,y
    this.editEntityId = ''
    this.leftDownFlag = false
    this.startMovePoint = null
    this.startMoveHeight = 0
    this.pickedEntity = null
    this.pickedEntityHeight = 0
    this.platform = 'pc'
    this.MousePosition = options.MousePosition
    this.PlottingStatus = options.PlottingStatus
    this.Finish = options.Finish
    this.VerticesFinish = options.VerticesFinish
    this.CurrentEditVertice = options.CurrentEditVertice
    this.VolumeAnalysisResult = options.VolumeAnalysisResult
    this.VolumeAnalysisProgress = options.VolumeAnalysisProgress
    this.maxHeigh = -1000000
    this.VolumeAnalysisEntities = [] // 体积测量（三角面实体）
    this.VolumeAnalysisBasePrimitive = null
    this.VolumeAnalysisInstances = []
    this._renderFrame = 0
    this.indexV1 = 0
    this.cutAreaV1 = 0
    this.cutVolumeV1 = 0
    this.fillAreaV1 = 0
    this.fillVolumeV1 = 0
    this.noAreaV1 = 0
    this.extrudedHeightV1 = 0
    this._indicesV1 = undefined
    this._positionsV1 = undefined
    this.KmlDataSource = null

    if (this.PlottingStatus) {
      this.PlottingStatus(false)
    }
    if (options.defaultColorValue) {
      this.colorValue = options.defaultColorValue
    }
    if (options.pointPositionVisible) {
      this.pointPositionVisible = options.pointPositionVisible
    }
    if (options.platform) {
      this.platform = options.platform
    }
  }

  removeKmlDataSource() {
    viewer.dataSources.remove(this.KmlDataSource)
  }

  addKmlDataSource(url, cb) {
    this.KmlDataSource = viewer.dataSources
      .add(
        Cesium.KmlDataSource.load(url, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
          clampToGround: true
        })
      )
      .then(kmlData => {
        if (cb) {
          if (kmlData.entities &&
            kmlData.entities.values &&
            kmlData.entities.values.length > 0) {
            const list = kmlData.entities.values.filter(
              _ => _.polygon || _.polyline
            )
            cb(list, kmlData.name)
          }
        }
      }).catch(() => {
        cb()
      })
  }

  handleShpData(feature, system, cb) {
    const positions = feature.geometry.coordinates[0]
    const _positions = []
    const Cartesian3Position = []
    const areaPoints = []
    for (let index = 0; index < positions.length; index++) {
      const pos = positions[index]
      if (system === 'GCJ-02') {
        const WGS84Position = HandleGCJ02ToWGS84(pos[0], pos[1])
        areaPoints.push([WGS84Position[0], WGS84Position[1]])
        _positions.push({
          longitude: WGS84Position[0],
          latitude: WGS84Position[1],
          altitude: pos[2] || 0,
        })
        Cartesian3Position.push(Cesium.Cartesian3.fromDegrees(
          WGS84Position[0],
          WGS84Position[1],
          pos[2]
        ))
      } else {
        areaPoints.push([pos[0], pos[1]])
        _positions.push({
          longitude: pos[0],
          latitude: pos[1],
          altitude: pos[2] || 0,
        })
        Cartesian3Position.push(Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2]))
      }
    }
    let drawingMode = ''
    let _centerPoint = null
    let _activeShapeComputed = 0
    if (feature.geometry.type === 'Polygon') {
      drawingMode = 'polygon'
      _centerPoint = cartesianToLongAndLat(Cesium.BoundingSphere.fromPoints(Cartesian3Position).center)
      _activeShapeComputed = getPolygonArea(areaPoints)
    } else {
      drawingMode = 'polyline'
      _centerPoint = _positions[0]
      _activeShapeComputed = getSpaceDistance(Cartesian3Position)
    }
    GetTerrainPosition(
      {
        longitude: _centerPoint.longitude,
        latitude: _centerPoint.latitude,
        altitude: _centerPoint.altitude > 0 ? _centerPoint.altitude : 0
      },
      position => {
        const result = {
          drawingMode: drawingMode,
          labelFont: this.labelFont,
          activeShapeComputed: _activeShapeComputed,
          centerPoint: position,
          verticesPosition: _positions,
          activeSubLine: [],
          activeShapePoints: _positions
        }
        if (cb) {
          cb(result)
        }
      }
    )
  }

  handleKmlData(entity, system, cb) {
    let Cartesian3Position = []
    let drawingMode = ''
    if (entity.polygon) {
      entity.polygon.zIndex = -1
      drawingMode = 'polygon'
      Cartesian3Position =
        entity.polygon.hierarchy.getValue(viewer.clock.currentTime).positions
    } else {
      drawingMode = 'polyline'
      Cartesian3Position = entity.polyline.positions.getValue(viewer.clock.currentTime)
    }
    const positions = Cartesian3Position.map(_ => cartesianToLongAndLat(_))
    let _positions = positions
    if (system === 'GCJ-02') {
      _positions = positions.map((_) => {
        const WGS84Position = HandleGCJ02ToWGS84(_.longitude, _.latitude)
        return {
          longitude: WGS84Position[0],
          latitude: WGS84Position[1],
        }
      })
    }
    const _Cartesian3Position = _positions.map(_ => Cesium.Cartesian3.fromDegrees(_.longitude, _.latitude, _.altitude))
    const areaPoints = []
    for (let index = 0; index < _positions.length; index++) {
      const point = _positions[index]
      areaPoints.push([point.longitude, point.latitude])
    }
    let _centerPoint = null
    let _activeShapeComputed = 0
    let _activeSubLine = []
    if (drawingMode === 'polygon') {
      _activeShapeComputed = getPolygonArea(areaPoints)
      _centerPoint = cartesianToLongAndLat(Cesium.BoundingSphere.fromPoints(_Cartesian3Position).center)
    } else {
      _centerPoint = _positions[0]
      _activeShapeComputed = getSpaceDistance(_Cartesian3Position)
      _activeSubLine = makeLineSegment(_positions).map(_ => {
        return {
          start: _.points[0],
          end: _.points[1],
          centerPoint: _.center,
          distance: _.distance
        }
      })
    }
    GetTerrainPosition(
      {
        longitude: _centerPoint.longitude,
        latitude: _centerPoint.latitude,
        altitude: _centerPoint.altitude > 0 ? _centerPoint.altitude : 0
      },
      position => {
        const result = {
          drawingMode: drawingMode,
          labelFont: this.labelFont,
          activeShapeComputed: _activeShapeComputed,
          centerPoint: position,
          verticesPosition: _positions,
          activeSubLine: _activeSubLine,
          activeShapePoints: _positions
        }
        if (cb) {
          cb(result)
        }
      }
    )
  }

  getPercentage(num, total) {
    if (num === 0 || total === 0) {
      return 0
    }
    return Math.round(num / total * 10000) / 100.00
  }

  removeVolumeAnalysisEntity(cb) {
    if (this.VolumeAnalysisEntities.length > 0) {
      return Promise.all(
        this.VolumeAnalysisEntities.map(item => {
          viewer.entities.remove(item.entity)
        })
      ).then(() => {
        if (cb) {
          setTimeout(() => {
            cb(0)
          })
        }
      })
    } else {
      if (cb) {
        cb(1)
      }
    }
  }

  clearVolumeAnalysisBasePrimitive() {
    if (this.VolumeAnalysisBasePrimitive) {
      viewer.scene.primitives.remove(this.VolumeAnalysisBasePrimitive)
    }
  }

  addVolumeAnalysisBasePrimitive() {
    this.clearVolumeAnalysisBasePrimitive()
    this.VolumeAnalysisBasePrimitive = new Cesium.Primitive({
      geometryInstances: this.VolumeAnalysisInstances,
      appearance: new Cesium.PerInstanceColorAppearance({
        // faceForward: true,
        flat: true, // 当 true 时，片段着色中使用平面着色，这意味着不考虑照明。
        // translucent: false, // 当 true 时，几何体将显示为半透明
        // closed: true
      })
    })
    viewer.scene.primitives.add(this.VolumeAnalysisBasePrimitive)
  }

  addVolumeAnalysisPrimitive(points, extrudedHeight, index) {
    const { pos0, pos1, pos2 } = points
    const _hierarchy = [
      pos0._heightPos.longitude, pos0._heightPos.latitude, pos0._heightPos.altitude,
      pos1._heightPos.longitude, pos1._heightPos.latitude, pos1._heightPos.altitude,
      pos2._heightPos.longitude, pos2._heightPos.latitude, pos2._heightPos.altitude,
    ]

    // this.VolumeAnalysisInstances.push(new Cesium.GeometryInstance({
    //   geometry: new Cesium.PolygonGeometry({
    //     polygonHierarchy: new Cesium.PolygonHierarchy(
    //       Cesium.Cartesian3.fromDegreesArrayHeights(_hierarchy)
    //     ),
    //     extrudedHeight: extrudedHeight,
    //     perPositionHeight: true,
    //     closeTop: true,
    //     closeBottom: true,
    //     arcType: Cesium.ArcType.RHUMB,
    //     vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
    //   }),
    //   attributes: {
    //     color: new Cesium.ColorGeometryInstanceAttribute.fromColor(
    //       Cesium.Color.fromRandom()
    //     ),
    //     show: new Cesium.ShowGeometryInstanceAttribute(true)
    //   }
    // }))

    this.VolumeAnalysisInstances.push(new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonOutlineGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArrayHeights(_hierarchy)
        ),
        extrudedHeight: extrudedHeight,
        perPositionHeight: true,
        closeTop: true,
        closeBottom: true,
        arcType: Cesium.ArcType.RHUMB,
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT
      }),
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute.fromColor(
          // Cesium.Color.fromCssColorString('#fff')
          Cesium.Color.fromRandom()
        ),
        show: new Cesium.ShowGeometryInstanceAttribute(true)
      }
    }))
  }

  addVolumeAnalysisEntity(points, extrudedHeight, index) {
    const { pos0, pos1, pos2 } = points
    const entity = viewer.entities.add({
      name: '三角面',
      parent: this.plotBaseEntity,
      polygon: {
        hierarchy: [pos0.heightPos, pos1.heightPos, pos2.heightPos],
        perPositionHeight: true,
        material: Cesium.Color.fromRandom(),
        // material: Cesium.Color.GREEN.withAlpha(0.2),
        extrudedHeight: extrudedHeight,
        outline: true,
        outlineColor: Cesium.Color.WHITE
      }
    })
    this.VolumeAnalysisEntities.push({ index, entity: entity })
  }

  returnPosition(positions, index) {
    const cartesian = new Cesium.Cartesian3(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2])
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    const height = viewer.scene.globe.getHeight(cartographic) > 0 ? viewer.scene.globe.getHeight(cartographic) : viewer.scene.sampleHeight(cartographic)

    if (height > this.maxHeigh) {
      this.maxHeigh = height
    }

    return {
      _heightPos: cartesianToLongAndLat(Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)),
      heightPos: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height),
      noHeightPos: Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0),
      height: height
    }
  }

  createPolygonGeo(points, granularity) {
    // 计算网格粒度-精度
    const _granularity = (Math.PI / Math.pow(2, 11)) / granularity
    const polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
      positions: points,
      vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
      granularity: _granularity
    })
    // 创建多边形平面几何体
    const geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry)
    const indices = geom.indices // 获取顶点索引数据
    const result = {
      positions: geom.attributes.position.values,
      indices: indices
    }
    return result
  }

  // 体积测量
  VolumeAnalysis(positions, extrudedHeight, granularity) {
    this.removeVolumeAnalysisEntity((type) => {
      // if (!type) return
      let cutArea = 0
      let cutVolume = 0
      let fillArea = 0
      let fillVolume = 0
      let noArea = 0
      const polygonGeoData = this.createPolygonGeo(positions, granularity)
      const length = polygonGeoData.indices.length
      for (let index = 0; index < polygonGeoData.indices.length; index += 3) {
        const pos0 = this.returnPosition(polygonGeoData.positions, polygonGeoData.indices[index])
        const pos1 = this.returnPosition(polygonGeoData.positions, polygonGeoData.indices[index + 1])
        const pos2 = this.returnPosition(polygonGeoData.positions, polygonGeoData.indices[index + 2])
        this.addVolumeAnalysisEntity({ pos0, pos1, pos2 }, extrudedHeight, index)
        // 水平状态下三角形面积
        const area = ComputeArea4Triangle(pos0.noHeightPos, pos1.noHeightPos, pos2.noHeightPos)

        // 计算三个点的均高
        const height = (pos0.height + pos1.height + pos2.height) / 3
        if (height < extrudedHeight) {
          // 需要填方的部分
          fillArea += area
          const volume = area * (extrudedHeight - height)
          fillVolume += volume
        } else if (height === extrudedHeight) {
          noArea += area
        } else {
          // 需要挖方的部分
          cutArea += area
          const volume = area * (height - extrudedHeight)
          cutVolume += volume
        }
        if (this.VolumeAnalysisProgress) {
          this.VolumeAnalysisProgress(this.getPercentage(index + 1, length))
        }
      }
      const allArea = cutArea + fillArea + noArea
      const result = {
        allArea: allArea,
        cutArea: cutArea,
        cutVolume: cutVolume,
        fillArea: fillArea,
        fillVolume: fillVolume,
        noArea: noArea,
      }
      if (this.VolumeAnalysisResult) {
        this.VolumeAnalysisResult(result)
        if (this.VolumeAnalysisProgress) {
          this.VolumeAnalysisProgress(this.getPercentage(1, 1))
        }
      }
      viewer.scene.screenSpaceCameraController.enableCollisionDetection = true // 允许相机进入地下
    })
  }

  VolumeAnalysisV1(positions, extrudedHeight, granularity) {
    if (extrudedHeight) {
      this.extrudedHeightV1 = extrudedHeight
    }
    if (positions instanceof Array) {
      const polygonGeoData = this.createPolygonGeo(positions, granularity)
      this._indicesV1 = polygonGeoData.indices
      this._positionsV1 = polygonGeoData.positions
    }
    if (this.indexV1 < this._indicesV1.length) {
      if (this.VolumeAnalysisProgress) {
        this.VolumeAnalysisProgress(this.getPercentage(this.indexV1, this._indicesV1.length))
      }
      const pos0 = this.returnPosition(this._positionsV1, this._indicesV1[this.indexV1])
      const pos1 = this.returnPosition(this._positionsV1, this._indicesV1[this.indexV1 + 1])
      const pos2 = this.returnPosition(this._positionsV1, this._indicesV1[this.indexV1 + 2])
      // this.addVolumeAnalysisEntity({ pos0, pos1, pos2 }, this.extrudedHeightV1, this.indexV1)
      this.addVolumeAnalysisPrimitive({ pos0, pos1, pos2 }, this.extrudedHeightV1, this.indexV1)
      // 水平状态下三角形面积
      const area = ComputeArea4Triangle(pos0.noHeightPos, pos1.noHeightPos, pos2.noHeightPos)
      // 计算三个点的均高
      const height = (pos0.height + pos1.height + pos2.height) / 3
      if (height < this.extrudedHeightV1) {
        // 需要填方的部分
        this.fillAreaV1 += area
        const volume = area * (this.extrudedHeightV1 - height)
        this.fillVolumeV1 += volume
      } else if (height == this.extrudedHeightV1) {
        this.noAreaV1 += area
      } else {
        // 需要挖方的部分
        this.cutAreaV1 += area
        const volume = area * (height - this.extrudedHeightV1)
        this.cutVolumeV1 += volume
      }
      this.indexV1 += 3
      this._renderFrame = requestAnimationFrame(this.VolumeAnalysisV1.bind(this))
    } else {
      const allArea = this.cutAreaV1 + this.fillAreaV1 + this.noAreaV1
      const result = {
        allArea: allArea || 0,
        cutArea: this.cutAreaV1 || 0,
        cutVolume: this.cutVolumeV1 || 0,
        fillArea: this.fillAreaV1 || 0,
        fillVolume: this.fillVolumeV1 || 0,
        noArea: this.noAreaV1 || 0,
      }
      if (this.VolumeAnalysisResult) {
        this.VolumeAnalysisResult(result)
        if (this.VolumeAnalysisProgress) {
          this.addVolumeAnalysisBasePrimitive()
          this.VolumeAnalysisProgress(this.getPercentage(1, 1))
        }
      }
      this.cancelCalcAnimation()
    }
  }

  cancelCalcAnimation() {
    window.cancelAnimationFrame(this._renderFrame)
    this._renderFrame = 0
    this.indexV1 = 0
    this.cutAreaV1 = 0
    this.cutVolumeV1 = 0
    this.fillAreaV1 = 0
    this.fillVolumeV1 = 0
    this.noAreaV1 = 0
    this.extrudedHeightV1 = 0
    this._indicesV1 = undefined
    this._positionsV1 = undefined
  }

  SetEventDisabled(status) {
    this.disabledEvent = status
  }

  CreateVertex(index, type, position) {
    if (!type) {
      return
    }
    if (type === -1) {
      // 删除
      const deleteVertexEntity = this.vertexEntities[index]
      if (!deleteVertexEntity) {
        return
      }
      viewer.entities.remove(deleteVertexEntity)
      delete this.vertexEntities[index]
      this.activeShapePoints.splice(index, 1)
      this.verticesPosition.splice(index, 1)
    } else {
      const newVertexEntity = this.addButtonEntities[index]
      if (!newVertexEntity) {
        return
      }
      let newPosition = newVertexEntity.position.getValue(viewer.clock.currentTime)
      if (type === 'before') {
        // 在指定顶点之前插入
        this.activeShapePoints.splice(index, 0, newPosition)
        this.verticesPosition.splice(index, 0, newPosition)
      } else if (type === 'after') {
        // 在指定顶点之后插入
        if (position && earthPosition instanceof Cesium.Cartesian3) {
          // 手动输入的坐标
          newPosition = position
        }
        this.activeShapePoints.splice(index + 1, 0, newPosition)
        this.verticesPosition.splice(index + 1, 0, newPosition)
      }
    }
    const lastVertex = this.verticesPosition[this.verticesPosition.length - 1]
    if (this.plotting) {
      if (this.activeShapePoints.length > this.verticesPosition.length) {
        // 在 PC 的绘制过程中，activeShapePoints 会包含一个浮动的坐标，它始终会比 verticesPosition 多一个坐标，所以在删除最后一个坐标后，需要将 activeShapePoints 最后一个和最后的前一个设置为同一个坐标，保证在删除顶点后，动态面显示正常
        const lastActiveShapPoint = this.activeShapePoints[this.activeShapePoints.length - 2]
        this.activeShapePoints.splice(this.activeShapePoints.length - 1, 1, lastActiveShapPoint)
      }
      if (this.floatingPoint && this.floatingPoint instanceof Cesium.Entity) {
        SetEntityPosition(this.floatingPoint, lastVertex)
        this.getMouseCurrentPosition(lastVertex)
      }
    }

    if (this.drawingMode === 'polygon') {
      SetEntityPolygonHierarchy(this.activeShape, this.activeShapePoints)
      this.drawAreaLabel()
    } else if (this.drawingMode === 'polyline') {
      const keys = Object.keys(this.distanceLabelEntities)
      if (keys.length > 0) {
        viewer.entities.remove(this.distanceLabelEntities[keys.length - 1])
        delete this.distanceLabelEntities[keys.length - 1]
        keys.pop()
        this.createDistanceLabel(keys.length - 1, lastVertex, 0)
      }
      this.drawLineLabel()
    }

    if (this.platform === 'pc') {
      //
    } else {
      this.setFinishPointPosition(lastVertex)
    }
    this.setVerticesNewIndex()
    this.setVerticesPositionValue()
    this.removeDeleteVertexButtonEntity()
    if (!this.plotting) {
      this.terminateShape()
    }
  }

  SetGraphicNewStyle(options) {
    const { text, colorValue, font } = options
    this.labelFont = font || '30px sans-serif'
    this.plotName = text
    this.colorValue = colorValue
    const _color = this.colorValue || '#17E980'
    const _fillColor = _color ? new Cesium.Color.fromCssColorString(_color) : new Cesium.Color.fromCssColorString('#17E980')
    for (const key in this.vertexEntities) {
      if (Object.hasOwnProperty.call(this.vertexEntities, key)) {
        const entity = this.vertexEntities[key]
        SetEntityPointColor(entity, new Cesium.Color.fromCssColorString(_color))
        if (this.drawingMode === 'point') {
          SetEntityLabelText(entity, FormatGraphicLabelText('point', {
            name: this.plotName
          }))
        } else if (this.drawingMode === 'text') {
          SetEntityLabelFont(entity, this.labelFont)
          SetEntityLabelFillColor(entity, _fillColor)
          SetEntityLabelText(entity, FormatGraphicLabelText('point', {
            name: this.plotName || '请输入文本内容'
          }))
        }
      }
    }
    if (this.drawingMode === 'polyline') {
      SetEntityPolylineMaterial(this.activeShape, new Cesium.Color.fromCssColorString(_color))
      SetEntityLabelText(this.totalDistanceLabelEntity, FormatGraphicLabelText('polyline', {
        name: this.plotName,
        value: this.activeShapeComputed
      }))
    } else if (this.drawingMode === 'polygon') {
      SetEntityPolygonMaterial(this.activeShape, new Cesium.Color.fromCssColorString(_color))
      SetEntityLabelText(this.areaLabelEntity, FormatGraphicLabelText('polygon', {
        name: this.plotName,
        value: this.activeShapeComputed
      }))
    }
  }

  AddEditPlotData(data) {
    let _activeShapePoints = []
    let _verticesPosition = []
    if (data.objectInfo.activeShapePoints && data.objectInfo.activeShapePoints.length > 0) {
      _activeShapePoints = data.objectInfo.activeShapePoints.map(_ => {
        return Cesium.Cartesian3.fromDegrees(_.longitude, _.latitude, _.altitude)
      })
    }

    if (data.objectInfo.verticesPosition && data.objectInfo.verticesPosition.length > 0) {
      _verticesPosition = data.objectInfo.verticesPosition.map(_ => {
        return Cesium.Cartesian3.fromDegrees(_.longitude, _.latitude, _.altitude)
      })
    }

    const centerPoint = data.objectInfo.centerPoint
    const centerPointCartesian3 = Cesium.Cartesian3.fromDegrees(
      centerPoint.longitude,
      centerPoint.latitude,
      centerPoint.altitude
    )

    this.plotName = data.towerName
    this.drawingMode = data.objectInfo.drawingMode
    this.colorValue = data.objectInfo.colorValue.hex8
    this.labelFont = data.objectInfo.labelFont
    this.activeShapeComputed = data.objectInfo.activeShapeComputed
    this.activeSubLine = data.objectInfo.activeSubLine
    this.activeShapePoints = _activeShapePoints
    this.verticesPosition = _verticesPosition
    this.activeShape = this.drawShape(this.verticesPosition)
    this.setVerticesPositionValue()
    if (_verticesPosition.length > 0 && _verticesPosition.length < 50) {
      // 顶点高度为拾取时的实际高
      _verticesPosition.map((earthPosition, index) => {
        const _id = `${this.drawingMode}_vertices_${index}_${this.ID}`
        this.vertexEntities[index] = this.createPoint(earthPosition, _id)
      })
    }
    if (this.drawingMode === 'polygon') {
      this.areaLabelEntity = this.createAreaLabel(centerPointCartesian3, this.activeShapeComputed)
    } else if (this.drawingMode === 'polyline') {
      if (this.activeSubLine.length > 0) {
        this.activeSubLine.map((item, index) => {
          this.createPlottingDistanceLabel(
            index,
            Cesium.Cartesian3.fromDegrees(
              item.centerPoint.longitude,
              item.centerPoint.latitude,
              item.centerPoint.altitude
            ),
            item.distance
          )
        })
        this.setTotalDistancePositionAndLabel(this.activeShapePoints[0], this.activeShapeComputed)
      }
    }
    this.terminateShape()
  }

  ChangeVertexPosition(position) {
    const earthPosition = new Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.altitude
    )
    SetEntityPosition(this.vertexEntities[parseInt(this.editEntityId.split('_')[2])], earthPosition)
    if (this.drawingMode === 'polygon') {
      this.setPolygonNewShape(this.activeShape, earthPosition)
    } else if (this.drawingMode === 'polyline') {
      this.setPolylineNewShape(this.activeShape, earthPosition)
      this.drawLineLabel()
    } else {
      this.setPointNewShap(earthPosition)
    }
    this.terminateShape()
  }

  ContinueDrawing(position) {
    if (position) {
      const earthPosition = Cesium.Cartesian3.fromDegrees(
        parseFloat(position.longitude),
        parseFloat(position.latitude),
        parseFloat(position.altitude)
      )
      const windowPosition = LongAndLatToWindowPosition(position)
      this.leftClickAction({
        position: windowPosition
      }, earthPosition)
    }
  }

  FlyToPosition(position, callback) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        position.longitude,
        position.latitude,
        1000
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0
      },
      duration: 1,
      complete: function () {
        if (callback) {
          callback()
        }
      }
    })
  }

  SetEditVertexId(val) {
    const entityId = `${this.drawingMode}_vertices_${val}_${this.ID}`
    if (this.drawingMode === 'polyline' || this.drawingMode === 'polygon') {
      this.removeDeleteVertexButtonEntity()
    }
    const entity = this.vertexEntities[parseInt(this.editEntityId.split('_')[2])]
    if (entity && entity instanceof Cesium.Entity) {
      SetEntityPointPixelSize(entity, 14)
    }
    this.editEntityId = entityId
    if (this.CurrentEditVertice) {
      this.CurrentEditVertice(this.editEntityId)
    }
    const index = parseInt(this.editEntityId.split('_')[2])
    if (index > -1) {
      const newEntity = this.vertexEntities[index]
      if (newEntity) {
        SetEntityPointPixelSize(newEntity, 24)
        if (this.platform === 'pc' && (this.drawingMode === 'polyline' || this.drawingMode === 'polygon')) {
          this.setDeleteVertexButtonEntityPosition(newEntity.position.getValue(viewer.clock.currentTime))
        }
      }
    }
  }

  StopPlot() {
    this.plotting = false
    viewer._container.style.cursor = 'default'
    if (this.PlottingStatus) {
      this.PlottingStatus(false)
    }
  }

  StartPlot(type) {
    this.Init()
    type ? this.drawingMode = type : void (0)
    this.plotting = true
    viewer._container.style.cursor = 'crosshair'
    if (this.PlottingStatus) {
      this.PlottingStatus(true)
    }
  }

  setVerticesNewIndex() {
    // 先把顶点全部清空
    for (const key in this.vertexEntities) {
      if (Object.hasOwnProperty.call(this.vertexEntities, key)) {
        const entity = this.vertexEntities[key]
        viewer.entities.remove(entity)
        delete this.vertexEntities[key]
      }
    }
    // 重新添加顶点
    this.verticesPosition.map((id, index) => {
      const _id = `${this.drawingMode}_vertices_${index}_${this.ID}`
      this.vertexEntities[index] = this.createPoint(this.verticesPosition[index], _id)
    })

    // 重新给顶点实体集合排序（但 Entity id 不能修改）
    // const delVerticesID = `${this.drawingMode}_vertices_${index}`
    // const keyMap = (o) => fun => {
    //   const newObject = {}
    //   Object.keys(o).forEach((key, index) => {
    //     newObject[fun(key, index)] = o[key]
    //   })
    //   return newObject
    // }
    // const newVertexEntities = keyMap(this.vertexEntities)((e, index) => {
    //   const arr = e.split('_')
    //   const a = arr[0]
    //   const b = arr[1]
    //   const newKey = `${a}_${b}_${index}`
    //   return newKey
    // })
    // for (const key in newVertexEntities) {
    //   if (Object.hasOwnProperty.call(newVertexEntities, key)) {
    //     const entity = newVertexEntities[key]
    //     if (entity && entity instanceof Cesium.Entity) {
    //       entity.id = key
    //     }
    //   }
    // }
    // this.vertexEntities = newVertexEntities
  }

  createAddButtonEntity(index, position) {
    let entity = null
    const _id = `addButton_${index}_${this.ID}`
    if (this.addButtonEntities[index]) {
      entity = this.addButtonEntities[index]
      SetEntityPosition(entity, position)
    } else {
      entity = viewer.entities.add({
        name: 'plot',
        position: position,
        parent: this.plotBaseEntity,
        id: _id,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 12,
          show: !this.plotting
        }
      })
    }
    return entity
  }

  ResetAddButtonEntities() {
    if (this.verticesPosition.length > 50) {
      return
    }
    const _verticesPosition = this.verticesPosition.filter(_ => _)
    if (this.drawingMode === 'polygon') {
      const firstVertex = _verticesPosition[0]
      _verticesPosition.push(firstVertex)
    }
    const subLine = VerticesToLines(_verticesPosition)
    for (const key in this.addButtonEntities) {
      if (Object.hasOwnProperty.call(this.addButtonEntities, key)) {
        const entity = this.addButtonEntities[key]
        viewer.entities.remove(entity)
        delete this.addButtonEntities[key]
      }
    }
    subLine.map((line, index) => {
      this.addButtonEntities[index] = this.createAddButtonEntity(index, line.center)
    })
  }

  setVerticesPositionValue() {
    if (this.VerticesFinish) {
      const _verticesPosition = this.verticesPosition.filter(_ => _).map(_ => cartesianToLongAndLat(_))
      this.VerticesFinish(_verticesPosition)
    }
    this.ResetAddButtonEntities()
  }

  getMouseCurrentPosition(Cartesian3) {
    const scratch = new window.Cesium.Cartesian2()
    const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
      Cartesian3,
      scratch
    )
    if (window.Cesium.defined(canvasPosition)) {
      const mousePosition = {
        map: cartesianToLongAndLat(Cartesian3),
        screen: canvasPosition
      }
      if (this.MousePosition) {
        this.MousePosition(mousePosition)
      }
    }
  }

  clearAllPlotEntity() {
    if (this.plotBaseEntity) {
      if (this.plotBaseEntity._children && this.plotBaseEntity._children.length > 0) {
        const list = this.plotBaseEntity._children
        for (let index = 0; index < list.length; index++) {
          const entity = list[index]
          viewer.entities.remove(entity)
        }
      }
      viewer.entities.remove(this.plotBaseEntity)
    }
  }

  addPlotBaseEntity() {
    const id = `plotBaseEntity_${this.ID}`
    viewer.entities.remove(viewer.entities.getById(id))
    this.plotBaseEntity = new Cesium.Entity({
      id: id,
      show: true,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    })
    viewer.entities.add(this.plotBaseEntity)
  }

  terminateShape() {
    viewer._container.style.cursor = 'default'
    if (this.activeShapePoints.length > this.verticesPosition.length) {
      // 删除浮动点
      this.activeShapePoints.pop()
    }
    const keys = Object.keys(this.distanceLabelEntities)
    if (this.activeShapePoints.length === keys.length) {
      // 在结束绘制前，如果浮动点未停留在最后一个顶点上，只要有移动，就会新增一条浮动的折线，需要删除
      const lastKeys = keys[keys.length - 1]
      viewer.entities.remove(this.distanceLabelEntities[lastKeys])
      delete this.distanceLabelEntities[lastKeys]
      this.activeSubLine.pop()
    }
    this.drawShape(this.activeShapePoints)
    let centerPoint = this.activeShapePoints[0]
    if (this.drawingMode === 'polygon') {
      centerPoint = getPolygonCenterByEntity(this.activeShape)
    }
    const _centerPoint = cartesianToLongAndLat(centerPoint)
    const _activeShapePoints = this.activeShapePoints.filter(_ => _).map(_ => cartesianToLongAndLat(_))
    const _verticesPosition = this.verticesPosition.filter(_ => _).map(_ => cartesianToLongAndLat(_))
    if (this.Finish) {
      this.Finish({
        drawingMode: this.drawingMode,
        labelFont: this.labelFont,
        activeShapeComputed: this.activeShapeComputed,
        centerPoint: _centerPoint,
        verticesPosition: _verticesPosition,
        activeSubLine: this.activeSubLine,
        activeShapePoints: _activeShapePoints
      })
    }
    viewer.entities.remove(this.finishPointEntity)
    this.finishPointEntity = null
    viewer.entities.remove(this.floatingPoint)
    this.floatingPoint = null
    this.StopPlot()
    this.ResetAddButtonEntities()
  }

  setPointNewShap(earthPosition) {
    this.verticesPosition = [earthPosition]
    this.activeShapePoints = [earthPosition]
    this.setVerticesPositionValue()
  }

  setPolylineNewShape(entity, earthPosition) {
    const index = parseInt(this.editEntityId.split('_')[2])
    const oldPositions = entity.polyline.positions.getValue(viewer.clock.currentTime)
    oldPositions.splice(index, 1, earthPosition)
    this.verticesPosition.splice(index, 1, earthPosition)
    this.activeShapePoints = oldPositions
    SetEntityPolylinePositions(entity, oldPositions)
    this.drawLineLabel() // 待优化（仅更新顶点相邻的两条边上的标注位置）
    // this.drawLineDistanceLabel(earthPosition) // 优化（只更新顶点相邻的两边距离及总距离）
    this.setVerticesPositionValue()
  }

  setPolygonNewShape(entity, earthPosition) {
    const _earthPositionObj = Object.assign({
      x: earthPosition.x,
      y: earthPosition.y,
      z: earthPosition.z
    })
    const _earthPosition = new Cesium.Cartesian3(_earthPositionObj.x, _earthPositionObj.y, _earthPositionObj.z)
    const index = parseInt(this.editEntityId.split('_')[2])
    const oldHierarchy = entity.polygon.hierarchy.getValue(viewer.clock.currentTime).positions
    oldHierarchy.splice(index, 1, earthPosition)
    this.verticesPosition.splice(index, 1, _earthPosition)
    this.activeShapePoints = oldHierarchy
    SetEntityPolygonHierarchy(entity, oldHierarchy)
    this.drawAreaLabel()
    this.setVerticesPositionValue()
  }

  setDeleteVertexButtonEntityPosition(earthPosition) {
    if (this.deleteVertexButtonEntity) {
      SetEntityPosition(this.deleteVertexButtonEntity, earthPosition)
    } else {
      this.deleteVertexButtonEntity = this.createDeleteVertexButtonEntity(earthPosition)
    }
  }

  removeDeleteVertexButtonEntity() {
    viewer.entities.remove(this.deleteVertexButtonEntity)
    this.deleteVertexButtonEntity = null
  }

  createDeleteVertexButtonEntity(earthPosition) {
    let entity = null
    if (this.deleteVertexButtonEntity) {
      entity = this.deleteVertexButtonEntity
    } else {
      const id = `deleteVertexButton_${this.ID}`
      entity = viewer.entities.add(
        new Cesium.Entity({
          id: id,
          name: 'plot',
          parent: this.plotBaseEntity,
          position: earthPosition,
          billboard: {
            image: require('@/assets/images/plotting/delete.png'),
            scale: 1,
            pixelOffset: new Cesium.Cartesian2(0.0, -30.0),
            color: Cesium.Color.RED,
            show: true
          }
        })
      )
    }
    return entity
  }

  setFinishPointPosition(earthPosition) {
    if (this.finishPointEntity && this.finishPointEntity instanceof Cesium.Entity) {
      SetEntityPosition(this.finishPointEntity, earthPosition)
    } else {
      this.finishPointEntity = this.createFinishPoint(earthPosition)
    }
  }

  createFinishPoint(earthPosition) {
    let entity = null
    if (this.finishPointEntity && this.finishPointEntity instanceof Cesium.Entity) {
      entity = this.finishPointEntity
    } else {
      const id = `finishPoint_${this.ID}`
      entity = this.finishPointEntity = viewer.entities.add({
        id: id,
        position: earthPosition,
        name: 'plot',
        parent: this.plotBaseEntity,
        billboard: {
          image: require('@/assets/images/plotting/finish.png'),
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
          scale: 0.5,
          eyeOffset: new Cesium.Cartesian3(0, 0, -10),
          show: true
        }
      })
    }
    return entity
  }

  createPoint(earthPosition, id) {
    if (this.platform !== 'pc') {
      if (this.drawingMode === 'polyline' || this.drawingMode === 'polygon') {
        let visible = false
        if (this.drawingMode === 'polyline') {
          if (this.verticesPosition.length >= 2) {
            visible = true
          }
        } else {
          if (this.verticesPosition.length >= 3) {
            visible = true
          }
        }
        if (visible) {
          this.setFinishPointPosition(earthPosition)
        }
      }
    }
    const _color = this.colorValue ? Cesium.Color.fromCssColorString(this.colorValue) : Cesium.Color.RED
    if (this.drawingMode === 'text') {
      const _text = FormatGraphicLabelText('text', {
        name: this.plotName || '请输入文本内容'
      })
      const label = viewer.entities.add({
        position: earthPosition,
        name: 'plot',
        parent: this.plotBaseEntity,
        label: {
          text: _text,
          font: this.labelFont,
          fillColor: _color,
          // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          // outlineWidth: 2,
          // outlineColor: Cesium.Color.fromCssColorString('#fff'),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
          show: true
        }
      })
      return label
    } else if (this.drawingMode === 'polyline' || this.drawingMode === 'polygon') {
      if (this.vertexEntities[parseInt(id.split('_')[2])]) {
        return
      }
      // const _text = FormatGraphicLabelText('vertex', {
      //   name: isNaN(parseInt(id.split('_')[2])) ? '' : parseInt(id.split('_')[2]) + 1
      // })
      const point = viewer.entities.add({
        position: earthPosition,
        name: 'plot',
        parent: this.plotBaseEntity,
        id: id,
        // label: { // 调试
        //   text: _text,
        //   font: this.labelFont,
        //   pixelOffset: new Cesium.Cartesian2(0.0, 40.0),
        //   fillColor: Cesium.Color.fromCssColorString('#fff'),
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   outlineWidth: 2,
        //   outlineColor: Cesium.Color.fromCssColorString('#000'),
        //   disableDepthTestDistance: Number.POSITIVE_INFINITY,
        //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
        //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
        //   show: true
        // },
        point: {
          color: _color,
          pixelSize: 14,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#fff')
        }
      })
      return point
    } else {
      let _text = FormatGraphicLabelText('text', {
        name: this.plotName
      })
      if (this.pointPositionVisible) {
        const _position = cartesianToLongAndLat(earthPosition)
        _text = FormatGraphicLabelText('point', _position)
      }
      if (viewer.entities.getById(id)) {
        const entity = viewer.entities.getById(id)
        SetEntityPosition(entity, earthPosition)
        SetEntityLabelText(entity, _text)
        return entity
      }
      const point = viewer.entities.add({
        position: earthPosition,
        name: 'plot',
        parent: this.plotBaseEntity,
        id: id,
        point: {
          color: _color,
          pixelSize: 14,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#fff')
        },
        label: {
          text: _text,
          font: this.labelFont,
          pixelOffset: new Cesium.Cartesian2(0.0, 40.0),
          fillColor: Cesium.Color.fromCssColorString('#fff'),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#000'),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
          show: true
        }
      })
      return point
    }
  }

  drawShape(positions) {
    const polylineColor = this.colorValue ? Cesium.Color.fromCssColorString(this.colorValue) : Cesium.Color.RED
    const polygonColor = this.colorValue ? Cesium.Color.fromCssColorString(this.colorValue) : Cesium.Color.WHITE.withAlpha(0.6)
    let shape = null
    if (this.drawingMode === 'polyline') {
      const id = `plotPolyline_${this.ID}`
      if (viewer.entities.getById(id)) {
        shape = viewer.entities.getById(id)
        SetEntityPolylinePositions(shape, positions)
      } else {
        shape = viewer.entities.add({
          id: id,
          name: 'plot',
          parent: this.plotBaseEntity,
          polyline: {
            positions: positions,
            material: polylineColor,
            depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.WHITE.withAlpha(0.6)
            }),
            width: 5
          }
        })
      }
    } else if (this.drawingMode === 'polygon') {
      const id = `plotPolygon_${this.ID}`
      if (viewer.entities.getById(id)) {
        shape = viewer.entities.getById(id)
        SetEntityPolygonHierarchy(shape, positions)
      } else {
        shape = viewer.entities.add({
          id: id,
          name: 'plot',
          parent: this.plotBaseEntity,
          polygon: {
            hierarchy: positions,
            zIndex: 999,
            material: new Cesium.ColorMaterialProperty(
              polygonColor
            )
          }
        })
      }
    }
    return shape
  }

  setTotalDistancePositionAndLabel(position, value) {
    const _value = FormatGraphicLabelText('polyline', {
      name: this.plotName,
      value: value
    })
    if (this.totalDistanceLabelEntity) {
      SetEntityPosition(this.totalDistanceLabelEntity, position)
      SetEntityLabelText(this.totalDistanceLabelEntity, _value)
    } else {
      this.totalDistanceLabelEntity = this.createTotalDistanceLabel(position, _value)
    }
  }

  createTotalDistanceLabel(position, value) {
    let entity = null
    if (this.totalDistanceLabelEntity) {
      entity = this.totalDistanceLabelEntity
    } else {
      const id = `plotPolylineTotal_${this.ID}`
      entity = viewer.entities.add({
        id: id,
        position: position,
        name: 'plot',
        parent: this.plotBaseEntity,
        label: {
          text: value,
          font: '30px sans-serif',
          pixelOffset: new Cesium.Cartesian2(0.0, 20.0),
          fillColor: Cesium.Color.fromCssColorString('#fff'),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#000'),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
          show: true
        }
      })
    }
    return entity
  }

  createDistanceLabel(index, centerPoint, distance) {
    let entity = null
    const _id = `distanceLabel_${index}_${this.ID}`
    const _text = FormatGraphicLabelText('polyline', {
      subValue: distance
    })
    if (this.distanceLabelEntities[index]) {
      entity = this.distanceLabelEntities[index]
      SetEntityPosition(entity, centerPoint)
      SetEntityLabelText(entity, _text)
    } else {
      entity = viewer.entities.add({
        id: _id,
        name: 'plot',
        position: centerPoint,
        parent: this.plotBaseEntity,
        label: {
          text: _text,
          font: '30px sans-serif',
          pixelOffset: new Cesium.Cartesian2(0.0, 20.0),
          fillColor: Cesium.Color.fromCssColorString('#fff'),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#000'),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
          show: true
        }
      })
    }
    return entity
  }

  createPlottingDistanceLabel(index, centerPoint, distance) {
    this.distanceLabelEntities[index] = this.createDistanceLabel(index, centerPoint, distance)
  }

  drawLineDistanceLabel() {
    if (!this.editEntityId) return
    const index = parseInt(this.editEntityId.split('_')[2])
    const currentVertice = this.vertexEntities[index]
    const beforeVertice = this.vertexEntities[index - 1]
    const afterVertice = this.vertexEntities[index + 1]
    const beforeLineLabel = this.distanceLabelEntities[index - 1]
    const afterLineLabel = this.distanceLabelEntities[index]
    if (beforeLineLabel) {
      // 计算顶点前一条折线的中心点及距离
      const beforeAddButton = this.addButtonEntities[index - 1]
      const center = beforeAddButton.position.getValue(viewer.clock.currentTime)
      const distance = GetTwoPointDistance(currentVertice.position.getValue(viewer.clock.currentTime), beforeVertice.position.getValue(viewer.clock.currentTime))
      this.createDistanceLabel(index - 1, center, distance)
    }
    if (afterLineLabel) {
      // 计算顶点后一条折线的中心点及距离
      const afterAddButton = this.addButtonEntities[index]
      const center = afterAddButton.position.getValue(viewer.clock.currentTime)
      const distance = GetTwoPointDistance(currentVertice.position.getValue(viewer.clock.currentTime), afterVertice.position.getValue(viewer.clock.currentTime))
      this.createDistanceLabel(index, center, distance)
    }
    // 计算总距离
    this.activeShapeComputed = getSpaceDistance(this.activeShapePoints)
    this.setTotalDistancePositionAndLabel(this.activeShapePoints[0], this.activeShapeComputed)
  }

  drawLineLabel() {
    if (this.activeShapePoints && this.activeShapePoints.length > 0) {
      const _activeShapePoints = this.activeShapePoints.map(_ => cartesianToLongAndLat(_))
      const lineSegment = makeLineSegment(_activeShapePoints)
      const _activeSubLine = lineSegment.map(_ => {
        return {
          start: _.points[0],
          end: _.points[1],
          distance: _.distance,
          centerPoint: _.center
        }
      })
      this.activeSubLine = _activeSubLine
      this.activeSubLine.map((line, index) => {
        if (line.start && line.end) {
          const centerPoint = new Cesium.Cartesian3.fromDegrees(line.centerPoint.longitude, line.centerPoint.latitude, line.centerPoint.altitude)
          const distance = line.distance
          if (centerPoint && distance) {
            this.createPlottingDistanceLabel(index, centerPoint, distance)
          }
        }
      })
      this.activeShapeComputed = getSpaceDistance(this.activeShapePoints)
      this.setTotalDistancePositionAndLabel(this.activeShapePoints[0], this.activeShapeComputed)
    }
  }

  createAreaLabel(centerPoint, area) {
    // 用海拔最高的顶点做中心点的高
    const altitudes = this.verticesPosition.filter(_ => _).map(_ => cartesianToLongAndLat(_)).map(_ => _.altitude)
    const max = altitudes.sort()[altitudes.length - 1]
    const position = cartesianToLongAndLat(centerPoint)
    const _centerPoint = Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude, max)
    const _text = FormatGraphicLabelText('polygon', {
      name: this.plotName,
      value: area
    })
    let entity = null
    const id = `plotPolygonTotal_${this.ID}`
    if (viewer.entities.getById(id)) {
      entity = viewer.entities.getById(id)
      SetEntityPosition(entity, _centerPoint)
      SetEntityLabelText(entity, _text)
    } else {
      entity = viewer.entities.add({
        id: id,
        position: _centerPoint,
        name: 'plot',
        parent: this.plotBaseEntity,
        label: {
          text: _text,
          font: '30px sans-serif',
          fillColor: Cesium.Color.fromCssColorString('#fff'),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: Cesium.Color.fromCssColorString('#000'),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.5),
          show: true
        }
      })
    }
    return entity
  }

  drawAreaLabel() {
    if (this.activeShapePoints && this.activeShapePoints.length > 1) {
      const centerPoint = getPolygonCenterByEntity(this.activeShape)

      const areaPoints = []
      const _verticesPosition = this.activeShapePoints.map(_ => cartesianToLongAndLat(_))
      const firstVertex = _verticesPosition[0]
      _verticesPosition.push(firstVertex)
      for (let index = 0; index < _verticesPosition.length; index++) {
        const element = _verticesPosition[index]
        areaPoints.push([element.longitude, element.latitude])
      }

      this.activeShapeComputed = parseFloat(getPolygonArea(areaPoints)).toFixed(2)
      if (centerPoint && this.activeShapeComputed) {
        this.areaLabelEntity = this.createAreaLabel(centerPoint, this.activeShapeComputed)
      }
    }
  }

  leftUpAction() {
    if (!this.leftDownFlag) {
      return
    }
    if (this.editEntityId) {
      this.leftDownFlag = false
      viewer._container.style.cursor = 'default'
      viewer.scene.screenSpaceCameraController.enableRotate = true
      this.terminateShape()
    }
  }

  leftDownAction(event) {
    if (this.editEntityId) {
      const pickModel = viewer.scene.pick(event.position)
      if (pickModel && pickModel.id && pickModel.id instanceof Cesium.Entity) {
        const entity = pickModel.id
        if (entity.id === this.editEntityId) {
          this.startMovePoint = event.position
          this.leftDownFlag = true
          this.startMoveHeight = Cesium.Cartographic.fromCartesian(
            entity.position.getValue(viewer.clock.currentTime)
          ).height
          viewer._container.style.cursor = 'move'
          this.pickedEntity = entity
          viewer.scene.screenSpaceCameraController.enableRotate = false
        }
      } else {
        this.leftUpAction(event)
      }
    }
  }

  rightClickAction() {
    let flag = false
    let message = ''
    if (this.plotting) {
      if (this.drawingMode === 'point' || this.drawingMode === 'text') {
        if (this.verticesPosition.length < 1) {
          flag = true
          message = '请至少绘制一个点！'
        }
      } else if (this.drawingMode === 'polyline') {
        if (this.verticesPosition.length < 2) {
          flag = true
          message = '请至少绘制两个点！'
        }
      } else if (this.drawingMode === 'polygon') {
        if (this.verticesPosition.length < 3) {
          flag = true
          message = '请至少绘制三个点！'
        }
      }
    }
    if (flag && message) {
      Message.error({
        customClass: 'message_new_style',
        message: message
      })
      return
    }
    if (this.plotting) {
      this.terminateShape()
    }
  }

  mouseMoveAction(movement, position) {
    let newPosition = null
    if (position && position instanceof Cesium.Cartesian3) {
      newPosition = position
    } else {
      try {
        newPosition = GetMouseEarthPosition(movement.endPosition).earthPosition
      } catch (error) {
        console.log(error)
      }
    }
    if (!newPosition) {
      return
    }
    viewer._container.style.cursor = 'default'
    if (this.plotting) {
      this.getMouseCurrentPosition(newPosition)
      viewer._container.style.cursor = 'crosshair'
      if (Cesium.defined(this.floatingPoint)) {
        if (Cesium.defined(newPosition)) {
          SetEntityPosition(this.floatingPoint, newPosition)
          this.activeShapePoints.pop()
          this.activeShapePoints.push(newPosition)
          if (this.drawingMode === 'polygon') {
            this.drawAreaLabel()
          } else if (this.drawingMode === 'polyline') {
            this.drawLineLabel()
          }
        }
      }
    } else if (this.leftDownFlag && this.editEntityId) {
      viewer._container.style.cursor = 'move'
      let position2 = null
      if (this.overlookStatus) {
        // 俯视，移动 xy
        // const cartesian = viewer.scene.camera.pickEllipsoid(
        //   movement.endPosition,
        //   viewer.scene.globe.ellipsoid
        // )
        const ray = viewer.camera.getPickRay(movement.endPosition)
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        const _position = cartesianToLongAndLat(cartesian)
        const _Cartesian3 = new Cesium.Cartesian3.fromDegrees(
          _position.longitude,
          _position.latitude,
          this.startMoveHeight
        )
        position2 = _Cartesian3
      } else {
        // 移动 z
        if (!this.startMovePoint) {
          return
        }
        const heightGap = movement.endPosition.y - this.startMovePoint.y
        const cartographic = cartesianToLongAndLat(this.pickedEntity.position.getValue(viewer.clock.currentTime))
        this.pickedEntityHeight = this.startMoveHeight - (heightGap / 10)
        if (this.pickedEntityHeight < 0) {
          this.pickedEntityHeight = 0
        }
        position2 = new Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude, this.pickedEntityHeight)
      }
      if (this.platform === 'pc' && (this.drawingMode === 'polyline' || this.drawingMode === 'polygon')) {
        this.setDeleteVertexButtonEntityPosition(position2)
      }
      const currentEntity = this.vertexEntities[parseInt(this.editEntityId.split('_')[2])]
      SetEntityPosition(currentEntity, position2)
      if (this.pointPositionVisible) {
        const text = FormatGraphicLabelText('point', cartesianToLongAndLat(position2))
        SetEntityLabelText(currentEntity, text)
      }
      if (this.drawingMode === 'polygon') {
        this.setPolygonNewShape(this.activeShape, position2)
      } else if (this.drawingMode === 'polyline') {
        this.setPolylineNewShape(this.activeShape, position2)
      } else {
        this.setPointNewShap(position2)
      }
    } else {
      const pickModel = viewer.scene.pick(movement.endPosition)
      if (pickModel && pickModel.id && pickModel.id instanceof Cesium.Entity) {
        if (pickModel.id.name && pickModel.id.name === 'plot') {
          viewer._container.style.cursor = 'pointer'
        }
      }
    }
  }

  leftClickAction(event, position) {
    if (this.plotting) {
      const mouseResult = GetMouseEarthPosition(event.position)
      let earthPosition = null
      let floating = false
      if (this.platform === 'pc') {
        floating = true
      }
      if (position && position instanceof Cesium.Cartesian3) {
        earthPosition = position
        // ※ 手动连续输入，如果加了浮动点，绘制的多边形会有问题，当前如果手动输入了，再点击地图继续绘制，不能显示出动态的图形变化，只能像 pad 一样点击之后直接出绘制结果
        floating = false
      } else {
        earthPosition = mouseResult.earthPosition
        if (mouseResult.pickModel && mouseResult.pickModel.id) {
          if (this.finishPointEntity) {
            // pad 上结束绘制
            if (this.finishPointEntity.id === mouseResult.pickModel.id.id) {
              this.rightClickAction()
              return
            }
          }
        }
      }
      if (!earthPosition) {
        return
      }
      const _this = this
      const _earthPositionObj = Object.assign({
        x: earthPosition.x,
        y: earthPosition.y,
        z: earthPosition.z
      })
      const _earthPosition = new Cesium.Cartesian3(_earthPositionObj.x, _earthPositionObj.y, _earthPositionObj.z)
      this.verticesPosition.push(_earthPosition)
      this.getMouseCurrentPosition(earthPosition)
      this.setVerticesPositionValue()
      if (Cesium.defined(earthPosition)) {
        if (this.activeShapePoints.length === 0) {
          if (floating) {
            this.activeShapePoints.push(earthPosition)
            const _id = `${this.drawingMode}_vertices_floating_${this.ID}`
            this.floatingPoint = this.createPoint(earthPosition, _id)
          }
          const dynamicPositions = new Cesium.CallbackProperty(function () {
            if (_this.drawingMode === 'polygon') {
              // ※ 绘制 polygon 动态设置 hierarchy，会将 activeShapePoints 每一个顶点的海拔置为 0 ？导致存储的多边形标绘顶点都为 0
              return new Cesium.PolygonHierarchy(_this.activeShapePoints)
            } else if (_this.drawingMode === 'polyline') {
              return _this.activeShapePoints
            }
          }, false)
          this.activeShape = this.drawShape(dynamicPositions)
        }
        this.activeShapePoints.push(earthPosition)
        let vertexEntityId = `${this.drawingMode}_vertices_${this.activeShapePoints.length - 1}_${this.ID}`
        if (this.activeShapePoints.length > this.verticesPosition.length) {
          vertexEntityId = `${this.drawingMode}_vertices_${this.activeShapePoints.length - 2}_${this.ID}`
        }
        if (this.drawingMode === 'polygon') {
          this.drawAreaLabel()
        } else if (this.drawingMode === 'polyline') {
          this.drawLineLabel()
        } else {
          this.terminateShape()
        }
        this.vertexEntities[parseInt(vertexEntityId.split('_')[2])] = this.createPoint(earthPosition, vertexEntityId)
      }
    } else {
      // 编辑
      const pickModel = viewer.scene.pick(event.position)
      if (pickModel && pickModel.id && pickModel.id instanceof Cesium.Entity) {
        const _id = pickModel.id.id
        if (_id.indexOf('_vertices') > -1) {
          this.SetEditVertexId(parseInt(_id.split('_')[2]))
        } else if (_id.indexOf('deleteVertexButton') > -1) {
          const index = parseInt(this.editEntityId.split('_')[2])
          MessageBox.confirm(`是否删除顶点${index + 1}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let flag = false
            let message = ''
            if (this.drawingMode === 'polyline') {
              if (this.verticesPosition.length <= 2) {
                flag = true
                message = '请至少保留两个点！'
              }
            } else if (this.drawingMode === 'polygon') {
              if (this.verticesPosition.length <= 3) {
                flag = true
                message = '请至少保留三个点！'
              }
            }
            if (flag && message) {
              Message.error({
                customClass: 'message_new_style',
                message: message
              })
              return
            }
            this.CreateVertex(index, -1)
          })
        } else if (_id.indexOf('addButton') > -1) {
          const index = parseInt(_id.split('_')[1])
          this.CreateVertex(index, 'after')
        }
      }
    }
  }

  removeInputActionFun() {
    if (this.eventHandler) {
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
    // ※ 移除无效，this 问题
    // viewer.camera.changed.removeEventListener(this.changedListener)
  }

  initInputActionFun() {
    const _this = this
    this.removeInputActionFun()
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.eventHandler.setInputAction(function (event) {
      if (_this.disabledEvent) {
        return
      }
      _this.leftClickAction(event)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.eventHandler.setInputAction(function (event) {
      if (_this.disabledEvent) {
        return
      }
      if (_this.platform !== 'pc') {
        _this.rightClickAction()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    this.eventHandler.setInputAction(function (event) {
      if (_this.disabledEvent) {
        return
      }
      _this.leftDownAction(event)
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.eventHandler.setInputAction(function (event) {
      if (_this.disabledEvent) {
        return
      }
      _this.leftUpAction(event)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    this.eventHandler.setInputAction(function (movement) {
      if (_this.disabledEvent) {
        return
      }
      _this.mouseMoveAction(movement)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.eventHandler.setInputAction(function (movement) {
      if (_this.disabledEvent) {
        return
      }
      _this.rightClickAction()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    // viewer.camera.percentageChanged = 0.00001
    // viewer.camera.changed.addEventListener(_this.changedListener.bind(_this))
  }

  Init() {
    // viewer.scene.globe.depthTestAgainstTerrain = true
    this.Destory()
    this.initInputActionFun()
    this.addPlotBaseEntity()
  }

  Destory() {
    viewer.entities.remove(this.floatingPoint)
    viewer.entities.remove(this.activeShape)
    viewer.entities.remove(this.finishPointEntity)
    viewer.entities.remove(this.startMovePoint)
    viewer.entities.remove(this.pickedEntity)
    this.floatingPoint = null
    this.activeShape = null
    this.finishPointEntity = null
    this.startMovePoint = null
    this.pickedEntity = null
    this.overlookStatus = true
    this.activeShapeComputed = 0
    this.labelFont = '30px sans-serif'
    this.plotName = ''
    this.activeShapePoints = []
    this.activeSubLine = []
    this.verticesPosition = []
    this.editEntityId = ''
    this.currentEditPolygonTopPoint = null
    this.areaLabelEntity = null
    this.distanceLabelEntities = {}
    this.vertexEntities = {}
    this.addButtonEntities = {}
    this.totalDistanceLabelEntity = null
    this.leftDownFlag = false
    this.startMoveHeight = 0
    this.pickedEntityHeight = 0
    this.VolumeAnalysisInstances = []
    this.StopPlot()
    this.removeInputActionFun()
    this.clearAllPlotEntity()
    this.setVerticesPositionValue()
    this.clearVolumeAnalysisBasePrimitive()
    this.removeKmlDataSource()
  }
}
