<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import * as turf from '@turf/turf'
export default {
  data() {
    return {
      timer: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    viewer.entities.removeAll()
    const positions = turf
      .randomPoint(100, { bbox: [100, 50, 120, 70] })
      .features.map(_ => {
        return {
          longitude: _.geometry.coordinates[0],
          latitude: _.geometry.coordinates[1],
          altitude: 10
        }
      })
    console.log('........positions', positions)
    const position0 = positions[0]
    // 添加 glb 模型
    const modelEntity = viewer.entities.add({
      name: 'glb 模型',
      position: new Cesium.Cartesian3.fromDegrees(
        position0.longitude,
        position0.latitude,
        position0.altitude
      ),
      model: {
        uri: 'model/Cesium_Air.glb',
        minimumPixelSize: 256,
        maxumunScale: 20000
      }
    })
    // viewer.trackedEntity = modelEntity

    positions.map((point, index) => {
      const entity = viewer.entities.add(
        new Cesium.Entity({
          id: 'point' + index,
          name: 'point',
          position: Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitude
          ),
          data: {
            point
          },
          billboard: {
            image: require('@/assets/images/site.png'),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scale: 1,
            scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
            show: true
          }
        })
      )
    })
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      const _position = positions[Math.floor(Math.random() * positions.length)]
      console.log('.......', _position)
      moveAnimte(
        modelEntity,
        _position.longitude,
        _position.latitude,
        _position.altitude
      )
    }, 2000)

    function moveAnimte(model, longitude, latitude, altitude, speed) {
      console.log(
        '........moveAnimte',
        model,
        longitude,
        latitude,
        altitude,
        speed
      )
      if (model) {
        const p2 = new Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          altitude
        )
        let start = viewer.clock.currentTime
        const stop_ = Cesium.JulianDate.addSeconds(
          start,
          1.3,
          new Cesium.JulianDate()
        )
        const time = 2
        // if(model.startPos && speed){
        //     try {
        //         time = (Cesium.Cartesian3.distance(model.startPos, p2)/speed) +0.5
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // if(time < 0.)time = 0.7
        let stop = Cesium.JulianDate.addSeconds(
          start,
          time,
          new Cesium.JulianDate()
        )
        if (
          (typeof model.availability !== 'undefined' &&
            typeof model.availability.addInterval !== 'undefined') ||
          model.pos
        ) {
          // if (model.availability.length > 2) {
          //     console.log(model.availability)
          //     model.availability.removeInterval(model.availability.get(0));
          // }
          // model.availability.addInterval(
          //     new Cesium.TimeInterval({
          //         start: start,
          //         stop: stop_,
          //     })
          // );
          model.position.addSample(stop, p2)
        } else {
          // model.availability = new Cesium.TimeIntervalCollection([
          //     new Cesium.TimeInterval({
          //         start: start,
          //         stop: stop_
          //     })
          // ]);
          let property = new Cesium.SampledPositionProperty()
          property.addSample(stop, p2)
          model.position = property
          model.pos = true
          property = null
        }

        model.startPos = p2
        model.startPosition
          ? model.startPosition.push(p2)
          : (model.startPosition = [p2])

        start = null
        stop = null
      }
    }
  },
  methods: {}
}
</script>

<style>
</style>
