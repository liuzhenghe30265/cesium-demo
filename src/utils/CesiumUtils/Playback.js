/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  getEndPointByYawPitch,
  getHeadingDegByTwoPoints,
  getTwoPointDistance
} from './common'
import {
  setFirstCamera,
  removeFirstCamera
} from '@/utils/global/cesiumFunction.js'
// import Vue from 'vue'
var rocker = false
export default class Playback {
  /**
   * @param {*}
   * @param {*} options.points 点集合
   * @param {*} options.model 模型
   * @param {*} options.actionConeLength 动作视锥长度
   * @param {*} options.End  播放结束回调函数
   * @param {*} options.Progress  播放进度回调函数
   * @memberof Playback
   */
  constructor(options) {
    this.Destory()
    this.points = options.points || []
    this.model = options.model || {
      uri: 'model/Cesium_Air.glb',
      scale: 1,
      minimumPixelSize: 90
    }
    this.actionConeLength = options.actionConeLength || 50
    this.moveData = []
    // moveData 示例 [{
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
    // this.play = false
    this.conePrimitive = null
    this.coneOutLinePrimitive = null
    this.End = options.End
    this.Progress = options.Progress
    this.EventListenerFun = null
  }

  Init() {
    this.MakeMoveData()
    this.AddEventListener()
  }

  MakeMoveData() {
    const _start = Date.now()
    // 模型沿着轨迹移动（图标移动过的路径变色）
    if (!this.points || this.points.length === 0) {
      return
    }
    this.points = JSON.parse(JSON.stringify(this.points))
    const _points = []
    // 飞机到下一个航点才调整机头方向
    // 多动作航点，拆分为同一位置的多个航点，分别携带一个动作
    // turnTo 掉头

    // 处理 heading === -2 的航点（机头朝向下一个航点）
    // for (let index = 0; index < this.points.length; index++) {
    //   const element1 = this.points[index]
    //   if (element1 && element1.heading === -2) {
    //     const element2 = this.points[index + 1]
    //     if (element2) {
    //       element1.heading = getHeadingDegByTwoPoints(element1, element2)
    //     }
    //   }
    // }
    this.points.map((item, index) => {
      item.pointIndex = index
      if (index == 0 && item.waypointType == 20) {
        rocker = true
      }
      if (item.actionEntityList && item.actionEntityList.length > 0) {
        // 有动作
        item.actionEntityList.map((action, actionIndex) => {
          const _item = JSON.parse(JSON.stringify(item))
          _item.actionEntityList = [item.actionEntityList[actionIndex]]
          var podRang = {
            yaw: 0,
            pitch: 0,
            roll: 0
          }
          if (action) {
            podRang.yaw = action.yaw || 0
            podRang.pitch = 0 - action.pitch || 0
            podRang.roll = action.roll || 0
          }
          podRang.yaw = podRang.yaw + _item.heading
          _item.podRang = podRang
          if (rocker) {
            _points.push([
              Object.assign(_item)
            ])
          } else {
            _points.push([
              Object.assign({
                turnTo: true
              }, _item),
              Object.assign(_item)
            ])
          }
        })
      } else {
        // 无动作
        if (rocker) {
          _points.push([
            Object.assign(item)
          ])
        } else {
          _points.push([
            Object.assign({
              turnTo: true
            }, item),
            Object.assign(item)
          ])
        }
      }
    })
    if (!rocker) {
      for (let index = 0; index < _points.length; index++) {
        const element1 = _points[index]
        const element2 = _points[index + 1]
        // 后一组航点的第一个航点的机头朝向设置为前一组航点的第二个航点的机头朝向
        if (element1 && element2) {
          if (element2[0].heading === -2) {
            if (getTwoPointDistance(element1[1], element2[0]) == 0) {
              element2[0].heading = element1[0].heading
            } else {
              element2[0].heading = getHeadingDegByTwoPoints(element1[1], element2[0])
            }
          }
          element1[1].heading = element2[0].heading
        }
      }
    }

    const __points = this.concatArrFun(_points)
    var _time = _start
    __points.map((item, index) => {
      var baseNum = 1
      if (index != 0) {
        // 根据航点速度计算
        var offsetDistance = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude), Cesium.Cartesian3.fromDegrees(__points[index - 1].longitude, __points[index - 1].latitude, __points[index - 1].altitude))
        offsetDistance == 0 ? baseNum = 1 : baseNum = (offsetDistance / (item.speed || 10))
      }
      _time += baseNum * 1000
      if (index !== 0) {
        var beforeMoveData = this.moveData[this.moveData.length - 1]
        if (beforeMoveData.turnTo) {
          if (beforeMoveData && item) {
            beforeMoveData.startTime = Cesium.JulianDate.fromDate(new Date(beforeMoveData.time))
            beforeMoveData.endTime = Cesium.JulianDate.fromDate(new Date(_time))
          }
        }
      }
      this.moveData.push({
        actionEntityList: item.actionEntityList,
        longitude: item.longitude,
        latitude: item.latitude,
        altitude: item.altitude,
        heading: item.heading,
        time: _time,
        JulianDate: Cesium.JulianDate.fromDate(new Date(_time)),
        turnTo: item.turnTo,
        pointIndex: item.pointIndex,
        podRang: item.podRang
      })
    })
    // return
    const date = new Date(this.moveData[0].time)
    const start = Cesium.JulianDate.fromDate(date) // 获取第一个点的时间
    viewer.clock.startTime = start // 将多个点的第一个点设为轨迹播放的开始时间
    viewer.clock.currentTime = start // 修改时间轴的当前时间
    // viewer.clock.shouldAnimate = true // 开始播放
    const property = new Cesium.SampledPositionProperty()
    const ori = new Cesium.SampledProperty(Cesium.Quaternion)
    const podOrientation = new Cesium.SampledProperty(Cesium.Quaternion)
    for (let altitude = 0; altitude < this.moveData.length; altitude++) {
      const item = this.moveData[altitude]
      const thisTime = Cesium.JulianDate.fromDate(new Date(item.time))
      const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.altitude)
      // 添加每一个链接点的信息，到达的时间以及坐标位置
      property.addSample(thisTime, position)

      // 如果为摇臂预览
      if (rocker) {
        if (!item.podRang) {
          continue
        }
      }

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
      var podRang = item.podRang || {
        yaw: item.heading,
        pitch: 0,
        roll: 0
      }
      const devicePose = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(podRang.yaw), Cesium.Math.toRadians(podRang.pitch), Cesium.Math.toRadians(podRang.roll)))
      podOrientation.addSample(thisTime, devicePose)
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
    this.AddTrackEntity(startTime, stopTime, property, ori, podOrientation)
  }

  AddTrackEntity(startTime, stopTime, property, ori, podOrientation) {
    const _this = this
    if (viewer.entities.getById('trackEntity')) {
      viewer.entities.remove(viewer.entities.getById('trackEntity'))
    }
    const entity = viewer.entities.add({
      id: 'trackEntity',
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: startTime,
        stop: stopTime
      })]),
      viewFrom: new Cesium.Cartesian3(150, 150, 150),
      position: property, // 点集
      orientation: ori,
      podOrientation: podOrientation, // 吊舱角度
      model: _this.model,
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
    viewer.trackedEntity = entity
  }

  Speed(type) {
    if (viewer) {
      if (type === 1) {
        // 加速
        viewer.clockViewModel.multiplier *= 2
      } else {
        // 减速
        viewer.clockViewModel.multiplier /= 2
      }
    }
  }

  Restart() {
    this.play = false
    if (viewer && viewer.clock) {
      viewer.clock.currentTime = viewer.clock.startTime
    }
  }

  Play() {
    this.Init()

    this.play = true
    if (viewer && viewer.clock) {
      viewer.clock.shouldAnimate = true
    }
  }

  Pause() {
    this.play = false
    if (viewer && viewer.clock) {
      viewer.clock.shouldAnimate = false
    }
  }

  Lock() {
    setFirstCamera(viewer.trackedEntity)
  }

  Unlock() {
    removeFirstCamera()
  }
  Destory() {
    if (viewer) {
      viewer.clockViewModel.multiplier = 1
      viewer.trackedEntity = null
      const entity = viewer.entities.getById('trackEntity')
      if (entity) {
        viewer.entities.remove(entity)
      }
    }
    this.Restart()
    this.Pause()
    this.RemoveEventListener()
    this.ClearConePrimitive()
    this.Unlock()
    this.points = []
    this.moveData = []
    this.conePrimitive = null
    this.coneOutLinePrimitive = null
    this.EventListenerFun = null
    if (this.End) {
      this.End()
    }
  }

  RemoveEventListener() {
    if (viewer && this.EventListenerFun) {
      viewer.clock.onTick.removeEventListener(this.EventListenerFun)
      this.EventListenerFun = null
    }
  }

  AddEventListener() {
    const _this = this
    let flag = true
    this.RemoveEventListener()
    this.EventListenerFun = function (e) {
      if (_this.play) {
        let finds = false
        for (let index = 0; index < _this.moveData.length; index++) {
          const item = _this.moveData[index]
          if (item.startTime && item.endTime) {
            if (item.startTime.secondsOfDay < e.currentTime.secondsOfDay && item.endTime.secondsOfDay > e.currentTime.secondsOfDay) {
              if (flag) {
                _this.ClearConePrimitive()
                if (item.actionEntityList && item.actionEntityList.length > 0) {
                  _this.HandleAction(_this.moveData[index + 1])
                }
              }
              finds = true
              break
            }
          }
        }
        // console.log(_this.moveData)
        const startData = _this.moveData[0]
        const endData = _this.moveData[_this.moveData.length - 1]
        const progress = parseFloat((parseInt(e.currentTime.secondsOfDay - startData.JulianDate.secondsOfDay) / parseInt(endData.JulianDate.secondsOfDay - startData.JulianDate.secondsOfDay)).toFixed(2))
        _this.Progress(progress)
        if (e.currentTime.secondsOfDay > endData.JulianDate.secondsOfDay) {
          // _this.ClearConePrimitive()
          // _this.End()
          _this.Destory()
          _this.Progress(1)
          // Vue.$previewComp.play = false
          return
        }
        if (finds) {
          flag = false
        } else {
          flag = true
        }
      }
    }
    viewer.clock.onTick.addEventListener(_this.EventListenerFun)
  }

  ClearConePrimitive() {
    if (this.conePrimitive) {
      this.conePrimitive.destroy()
    }
    if (this.coneOutLinePrimitive) {
      this.coneOutLinePrimitive.destroy()
    }
  }

  HandleAction(point, index) {
    if (point.actionEntityList && point.actionEntityList.length > 0) {
      point.actionEntityList.map((action, index) => {
        const stratPosition = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
        const endPosition = getEndPointByYawPitch(
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
          this.actionConeLength
        )
        this.MakeCone(stratPosition, endPosition, point, action)

        // 更新相机位置（第一视角）
        // const center = entity.position.getValue(viewer.clock.currentTime)
        // const entity = viewer.entities.getById('trackEntity')
        // entity.viewFrom = new Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.altitude)
        // const heading = viewer.scene.camera.heading
        // const pitch = viewer.scene.camera.pitch
        // const roll = viewer.scene.camera.roll
        // viewer.camera.setView({
        //   destination: center,
        //   orientation: {
        //     heading: heading,
        //     pitch: pitch,
        //     roll: roll
        //   }
        // })
      })
    }
  }

  MakeCone(startPosition, endPosition) {
    this.ClearConePrimitive()
    const spotLightCamera = new Cesium.Camera(viewer.scene)
    const direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPosition,
      startPosition, new Cesium.Cartesian3()), new Cesium.Cartesian3())
    spotLightCamera.position = startPosition
    spotLightCamera.direction = direction
    spotLightCamera.up = Cesium.Cartesian3.clone(viewer.camera.up)
    spotLightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE
    spotLightCamera.frustum.near = 0.1
    spotLightCamera.frustum.aspectRatio = 1.0
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
    this.conePrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
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
    this.coneOutLinePrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: instanceOutline,
      eleaseGeometryInstances: false,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true
      })
    }))
  }

  concatArrFun(arr) {
    if (arr && arr.length > 0) {
      const result = arr.reduce((a, b) => {
        return a.concat(b)
      })
      return result
    }
  }
}
