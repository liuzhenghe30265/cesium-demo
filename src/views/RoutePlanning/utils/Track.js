/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { flattenDeep } from 'lodash'
import CesiumUtils from '@/utils/CesiumUtils.js'
export default class Track {
  /**
   * @param {*} viewer 需要传入
   * @param {*} options.points 点集合
   * @param {*} options.shootCallback  拍设点回调函数
   * @memberof Track
   */
  constructor(viewer, options) {
    this.viewer = viewer
    this.points = options.points || []
    this.moveData = []
    this.play = false
    this.conePrimitive = null
    this.coneOutLinePrimitive = null
    this.EventListener()
  }

  Init () {
    const _start = Date.now()
    const viewer = this.viewer
    // 模型沿着轨迹移动（图标移动过的路径变色）
    if (!this.points || this.points.length === 0) {
      return
    }
    const _points = []
    // 飞机到下一个航点才调整机头方向
    // 把每个点都复制出一份，航点数变为两倍
    this.points.map((item, index) => {
      _points.push([
        Object.assign({
          original: true
        }, item),
        Object.assign(item)
      ])
    })

    for (let index = 0; index < _points.length; index++) {
      const element1 = _points[index]
      const element2 = _points[index + 1]
      // 后一组航点的第一个航点的机头朝向设置为前一组航点的第二个航点的机头朝向
      if (element1 && element2) {
        element2[0].heading = element1[1].heading
      }
    }

    const __points = flattenDeep(_points)
    __points.map((item, index) => {
      const _time = _start + index * 1000
      // if (index === 0 || index === 1) {
      //   _time = _start
      // }
      this.moveData.push({
        actionEntityList: item.actionEntityList,
        longitude: item.longitude,
        latitude: item.latitude,
        altitude: item.altitude,
        heading: item.heading,
        time: _time,
        JulianDate: Cesium.JulianDate.fromDate(new Date(_time)),
        original: item.original
      })
    })
    for (let index = 0; index < this.moveData.length; index++) {
      const element1 = this.moveData[index]
      const element2 = this.moveData[index + 1]
      if (element1.original) {
        if (element1 && element2) {
          element1.startTime = Cesium.JulianDate.fromDate(new Date(element1.time))
          element1.endTime = Cesium.JulianDate.fromDate(new Date(element2.time))
        }
      }
    }
    console.log('.......moveData', this.moveData)
    // const moveData = [{
    //   time: 1656047671018,
    //   longitude: 106,
    //   latitude: 39,
    //   altitude: 0
    // }, {
    //   time: 1656047771018,
    //   longitude: 132,
    //   latitude: 48,
    //   altitude: 0
    // }, {
    //   time: 1656047871018,
    //   longitude: 120,
    //   latitude: 32,
    //   altitude: 0
    // }]
    const date = new Date(this.moveData[0].time)
    const start = Cesium.JulianDate.fromDate(date) // 获取第一个点的时间
    viewer.clock.startTime = start // 将多个点的第一个点设为轨迹播放的开始时间
    viewer.clock.currentTime = start // 修改时间轴的当前时间
    // viewer.clock.shouldAnimate = true // 开始播放
    const property = new Cesium.SampledPositionProperty()
    const ori = new Cesium.SampledProperty(Cesium.Quaternion)
    for (let altitude = 0; altitude < this.moveData.length; altitude++) {
      const item = this.moveData[altitude]
      const thisTime = Cesium.JulianDate.fromDate(new Date(item.time))
      const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude)
      // 添加每一个链接点的信息，到达的时间以及坐标位置
      property.addSample(thisTime, position)

      // 机头朝向
      const device_hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(Number(item.heading || 0) - 90),
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(0)
      )
      const device_orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        device_hpr
      )
      ori.addSample(thisTime, device_orientation)
    }
    // 设置贴地
    // property.setInterpolationOptions({
    //   interpolationDegree: 2,
    //   interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
    // })
    const times = property._property._times
    const startTime = times[0].clone()
    const stopTime = times[times.length - 1].clone()
    const entity = viewer.entities.add({
      id: 'trackEntity',
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime
      })]),
      position: property, // 点集
      orientation: ori,
      model: {
        uri: 'model/Cesium_Air.glb',
        scale: 1,
        minimumPixelSize: 90
      },
      path: {
        show: true,
        leadTime: 0,
        trailTime: 60,
        width: 10,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          taperPower: 0.3,
          color: Cesium.Color.PALEGOLDENROD
        })
      }
    })
    // viewer.trackedEntity = entity
  }

  Restart () {
    this.play = false
    this.viewer.clock.currentTime = this.viewer.clock.startTime
  }

  Play () {
    this.play = true
    this.viewer.clock.shouldAnimate = true
  }

  Pause () {
    this.play = false
    this.viewer.clock.shouldAnimate = false
  }

  Destory () {
    this.viewer.trackedEntity = null
    const entity = this.viewer.entities.getById('trackEntity')
    if (entity) {
      this.viewer.entities.remove(entity)
    }
  }

  EventListener () {
    let k = true
    this.viewer.clock.onTick.addEventListener((e) => {
      if (this.play) {
        let finds = false
        for (let index = 0; index < this.moveData.length; index++) {
          const item = this.moveData[index]
          if (item.startTime && item.endTime) {
            if (item.startTime.secondsOfDay < e.currentTime.secondsOfDay && item.endTime.secondsOfDay > e.currentTime.secondsOfDay) {
              if (k) {
                this.HandleLookAt(item)
                if (item.actionEntityList && item.actionEntityList.length > 0) {
                  this.HandleAction(this.moveData[index + 1])
                }
              }
              finds = true
              break
            }
          }
        }
        if (finds) {
          k = false
        } else {
          k = true
        }
      }
    })
  }

  HandleLookAt (point) {

  }

  HandleAction (point) {
    if (point.actionEntityList && point.actionEntityList.length > 0) {
      point.actionEntityList.map((action, index) => {
        const stratPosition = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
        const endPosition = CesiumUtils.getEndPointByYawPitch(
          this.viewer,
          {
            longitude: point.longitude,
            latitude: point.latitude,
            altitude: point.altitude
          },
          point.heading,
          {
            yaw: action.yaw,
            pitch: action.pitch
          },
          40)
        this.MakeCone(stratPosition, endPosition, point, action)
      })
    }
  }

  MakeCone (startPosition, endPosition) {
    if (this.conePrimitive) {
      this.conePrimitive.destroy()
    }
    if (this.coneOutLinePrimitive) {
      this.coneOutLinePrimitive.destroy()
    }
    const spotLightCamera = new Cesium.Camera(this.viewer.scene)
    const direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPosition,
      startPosition, new Cesium.Cartesian3()), new Cesium.Cartesian3())
    spotLightCamera.position = startPosition // firstPos 是相机起点
    spotLightCamera.direction = direction // direction 是相机面向的方向
    spotLightCamera.up = Cesium.Cartesian3.clone(this.viewer.camera.up)
    spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE
    spotLightCamera.frustum.near = 0.1
    spotLightCamera.frustum.far = Cesium.Cartesian3.distance(startPosition, endPosition)
    const scratchRight = new Cesium.Cartesian3()
    const scratchRotation = new Cesium.Matrix3()
    const scratchOrientation = new Cesium.Quaternion()
    const position = spotLightCamera.positionWC
    const directionWC = spotLightCamera.directionWC
    const up = spotLightCamera.upWC
    let right = spotLightCamera.rightWC
    right = Cesium.Cartesian3.negate(right, scratchRight)

    const rotation = scratchRotation
    Cesium.Matrix3.setColumn(rotation, 0, right, rotation)
    Cesium.Matrix3.setColumn(rotation, 1, up, rotation)
    Cesium.Matrix3.setColumn(rotation, 2, directionWC, rotation)
    // 计算视锥姿态
    const orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation)

    // 视锥轮廓填充
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.FrustumGeometry({
        frustum: spotLightCamera.frustum,
        origin: startPosition,
        orientation: orientation
      }),
      id: 'conePrimitive',
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('#ff0').withAlpha(0.2)),
        show: new Cesium.ShowGeometryInstanceAttribute(true)
      }
    })
    this.conePrimitive = this.viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: instance,
      eleaseGeometryInstances: false,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    }))

    // 视锥轮廓线图形
    const instanceOutline = new Cesium.GeometryInstance({
      geometry: new Cesium.FrustumOutlineGeometry({
        frustum: spotLightCamera.frustum,
        origin: startPosition,
        orientation: orientation
      }),
      id: 'coneOutLinePrimitive',
      attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('#f00').withAlpha(1)),
        show: new Cesium.ShowGeometryInstanceAttribute(true)
      }
    })
    this.coneOutLinePrimitive = this.viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: instanceOutline,
      eleaseGeometryInstances: false,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    }))
  }
}