// 禁飞区

const NoFlyZoneIds = []

export function handleAddANoFlyZone(item, index) {
  NoFlyZoneIds.push('noFlyZone' + index)
  NoFlyZoneIds.push('noFlyZoneLabel' + index)
  // const stripeMaterial = new Cesium.StripeMaterialProperty({
  //   evenColor: Cesium.Color.YELLOW.withAlpha(0.15),
  //   oddColor: Cesium.Color.BLACK.withAlpha(0.15),
  //   repeat: 30.0
  // })
  const polyEntity = viewer.entities.add({
    name: 'Wyoming',
    id: 'noFlyZone' + index,
    // polygon: {
    //   hierarchy: Cesium.Cartesian3.fromDegreesArray(list),
    //   height: 0,
    //   material: stripeMaterial,
    //   outline: true,
    //   outlineColor: Cesium.Color.YELLOW,
    //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 7000.0),
    //   scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2)
    // }
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(item.list)
      ),
      extrudedHeight: 50.0,
      material: new Cesium.Color.fromCssColorString('#ff0000').withAlpha(0.1),
      outline: true,
      outlineColor: new Cesium.Color.fromCssColorString('#ff0000'),
      show: false
    }
  })
  const polyPositions = polyEntity.polygon.hierarchy.getValue(
    Cesium.JulianDate.now()
  ).positions
  const pCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
  const pCenterPosition = cartesianToLongAndLat(pCenter)

  const entity = viewer.entities.add(
    new Cesium.Entity({
      name: 'point',
      id: 'noFlyZoneLabel' + index,
      position: new Cesium.Cartesian3.fromDegrees(
        pCenterPosition.longitude,
        pCenterPosition.latitude,
        50
      ),
      label: {
        text: '禁飞区',
        font: '62px sans-serif',
        fillColor: new Cesium.Color.fromCssColorString('#fff'),
        outline: false,
        // outlineColor: new Cesium.Color.fromCssColorString('#fff'),
        // pixelOffset: new Cesium.Cartesian2(0.0, 30.0),
        outlineWidth: 1,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        showBackground: true,
        backgroundColor: new Cesium.Color.fromCssColorString('#fff').withAlpha(
          0.0
        ),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0.0,
          7000.0
        ),
        scaleByDistance: new Cesium.NearFarScalar(1.0e2, 0.6, 0.7e4, 0.2),
        show: false
      }
    })
  )
  return entity
}

// 添加禁飞区
export function addANoFlyZone(list) {
  list.map((item, index) => {
    handleAddANoFlyZone(item, index)
  })
}

// 设置禁飞区显示隐藏
export function setNoFlyZonVisible(status) {
  NoFlyZoneIds.map(id => {
    const _entity = viewer.entities.getById(id)
    if (_entity) {
      if (status) {
        if (id.indexOf('noFlyZoneLabel') > -1) {
          _entity.label.show = true
        } else {
          _entity.polygon.show = true
        }
      } else {
        if (id.indexOf('noFlyZoneLabel') > -1) {
          _entity.label.show = false
        } else {
          _entity.polygon.show = false
        }
      }
    }
  })
}
