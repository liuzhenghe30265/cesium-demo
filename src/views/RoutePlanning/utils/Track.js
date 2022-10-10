/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
    // this.EventListener()
  }

  Init () {
    const _start = Date.now()
    const viewer = this.viewer
    // 模型沿着轨迹移动（图标移动过的路径变色）
    const moveData = []
    if (!this.points || this.points.length === 0) {
      return
    }
    this.points.map((item, index) => {
      const _time = _start + index * 10000
      moveData.push({
        x: item.longitude,
        y: item.latitude,
        z: item.altitude,
        heading: item.heading,
        time: _time
      })
    })
    // const moveData = [{
    //   time: 1656047671018,
    //   x: 106,
    //   y: 39,
    //   z: 0
    // }, {
    //   time: 1656047771018,
    //   x: 132,
    //   y: 48,
    //   z: 0
    // }, {
    //   time: 1656047871018,
    //   x: 120,
    //   y: 32,
    //   z: 0
    // }]
    const date = new Date(moveData[0].time)
    const start = Cesium.JulianDate.fromDate(date) // 获取第一个点的时间
    viewer.clock.startTime = start // 将多个点的第一个点设为轨迹播放的开始时间
    viewer.clock.currentTime = start // 修改时间轴的当前时间
    // viewer.clock.shouldAnimate = true // 开始播放
    const property = new Cesium.SampledPositionProperty()
    const ori = new Cesium.SampledProperty(Cesium.Quaternion)
    for (let z = 0; z < moveData.length; z++) {
      const item = moveData[z]
      const thisTime = Cesium.JulianDate.fromDate(new Date(item.time))
      const position = Cesium.Cartesian3.fromDegrees(item.x, item.y, item.z)
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
    this.viewer.clock.currentTime = this.viewer.clock.startTime
  }

  Play () {
    this.viewer.clock.shouldAnimate = true
  }

  Pause () {
    this.viewer.clock.shouldAnimate = false
  }

  EventListener () {
    this.viewer.clock.onTick.addEventListener((e) => {
      console.log('.......clock', e)
    })
  }
}