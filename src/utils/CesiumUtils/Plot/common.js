/**
 * @description: 标绘中格式化标注文字
 * @param {*} type
 * @param {*} data
 * @return {*}
 */
export function FormatGraphicLabelText(type, data) {
  let text = ''
  if (type === 'point') {
    const name = data.name ? `${data.name}\n` : ''
    const long = data.longitude ? `经度：${parseFloat(data.longitude).toFixed(7)}\n` : ''
    const lat = data.latitude ? `纬度：${parseFloat(data.latitude).toFixed(7)}\n` : ''
    const alt = parseFloat(data.altitude) || parseFloat(data.altitude) === 0 ? `高度：${parseFloat(data.altitude).toFixed(1)}m` : ''
    text = `${name}${long}${lat}${alt}`
  } else if (type === 'polyline') {
    const name = data.name ? `${data.name}\n` : ''
    const value = data.value && parseFloat(data.value) ? `总距离：${data.value}米` : ''
    const subValue = data.subValue && parseFloat(data.subValue) ? `${data.subValue}米` : ''
    text = `${name}${value}${subValue}`
  } else if (type === 'polygon') {
    const name = data.name ? `${data.name}\n` : ''
    const value = data.value && parseFloat(data.value) ? `${data.value}平方米` : ''
    text = `${name}${value}`
  } else if (type === 'text') {
    const name = data.name ? `${sliceString(data.name, 10).join('\n')}` : ''
    text = `${name}`
  } else if (type === 'vertex') {
    const name = data.name ? `${data.name}\n` : ''
    text = `${name}`
  }
  return text
}

function sliceString(str, length) {
  const result = []
  for (let i = 0; i < str.length; i += length) {
    result.push(str.slice(i, i + length))
  }
  return result
}

export function SetEntityPolygonHierarchy(entity, hierarchy) {
  if (entity && entity.polygon) {
    entity.polygon.hierarchy = new Cesium.CallbackProperty(function () {
      return new Cesium.PolygonHierarchy(hierarchy)
    }, false)
  }
}

export function SetEntityPolygonMaterial(entity, material) {
  if (entity && entity.polygon) {
    entity.polygon.material = material
  }
}

export function SetEntityPolylinePositions(entity, positions) {
  if (entity && entity.polyline) {
    entity.polyline.positions = new Cesium.CallbackProperty(function () {
      return positions
    }, false)
  }
}

export function SetEntityPolylineMaterial(entity, material) {
  if (entity && entity.polyline) {
    entity.polyline.material = material
  }
}

export function SetEntityLabelFillColor(entity, fillColor) {
  if (entity && entity.label) {
    entity.label.fillColor = fillColor
  }
}

export function SetEntityLabelFont(entity, font) {
  if (entity && entity.label) {
    entity.label.font = font
  }
}

export function SetEntityLabelText(entity, value) {
  if (entity && entity.label) {
    entity.label.text = value
  }
}

export function SetEntityPosition(entity, position) {
  if (entity && entity.position) {
    entity.position.setValue(position)
  }
}

export function SetEntityPointPixelSize(entity, pixelSize) {
  if (entity && entity.point) {
    entity.point.pixelSize = pixelSize
  }
}

export function SetEntityPointColor(entity, color) {
  if (entity && entity.point) {
    entity.point.color = color
  }
}

export function SetEntityPointOutlineColor(entity, outlineColor) {
  if (entity && entity.point) {
    entity.point.outlineColor = outlineColor
  }
}

export function SetEntityPointOutlineWidth(entity, outlineWidth) {
  if (entity && entity.point) {
    entity.point.outlineWidth = outlineWidth
  }
}
