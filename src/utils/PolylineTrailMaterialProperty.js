/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

export class PolylineTrailMaterialProperty {
  constructor(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT)
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = options.color
    this.duration = options.duration
    this.trailImage = options.trailImage
    this._time = performance.now()
  }
}
Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false
    }
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor('color')
})
PolylineTrailMaterialProperty.prototype.getType = function () {
  return 'PolylineTrail'
}
PolylineTrailMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {}
  }
  result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color)
  result.image = this.trailImage
  result.time = ((performance.now() - this._time) % this.duration) / this.duration
  return result
}
PolylineTrailMaterialProperty.prototype.equals = function (other) {
  return this === other || (other instanceof PolylineTrailMaterialProperty && Cesium.Property.equals(this._color, other._color))
}
Cesium.Material.PolylineTrailType = 'PolylineTrail'
Cesium.Material.PolylineTrailImage = 'images/colors.png'
Cesium.Material.PolylineTrailSource = 'czm_material czm_getMaterial(czm_materialInput materialInput)\n                                                 {\n                                                      czm_material material = czm_getDefaultMaterial(materialInput);\n                                                      vec2 st = materialInput.st;\n                                                      vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n                                                      material.alpha = colorImage.a * color.a;\n                                                      material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n                                                      return material;\n                                                  }'
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
  fabric: {
    type: Cesium.Material.PolylineTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      image: Cesium.Material.PolylineTrailImage,
      time: 0
    },
    source: Cesium.Material.PolylineTrailSource
  },
  translucent: function () {
    return true
  }
})
Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty