<template>
  <div
    id="cesium-container"
    style="width: 100%; height: 100%;"
  />
</template>

<script>
/* eslint-disable new-cap */
/* eslint-disable no-undef */
export default {
  name: 'Material',
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    window.$InitMap()

    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
    })

    // * 圆柱（entity，纯色材质）
    viewer.entities.add(
      new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(117.0, 39.0, 0),
        cylinder: {
          length: 50000.0,
          topRadius: 5000.0,
          bottomRadius: 5000.0,
          material: Cesium.Color.fromCssColorString('#0000ff').withAlpha(0.5)
        }
      })
    )

    // * 圆柱（entity，图片材质）
    viewer.entities.add(
      new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(117.11111, 39.11111, 0),
        cylinder: {
          length: 50000.0,
          topRadius: 5000.0,
          bottomRadius: 5000.0,
          material: new Cesium.ImageMaterialProperty({
            image: require('@/assets/images/text.png'),
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: true
            // color: new Cesium.CallbackProperty(function () {
            //   return Cesium.Color.WHITE.withAlpha(0.5)
            // }, false)
          })
        }
      })
    )

    // * 圆柱（primitive，纯色材质）
    viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: [
          new Cesium.GeometryInstance({
            geometry: new Cesium.CylinderGeometry({
              length: 50000.0,
              topRadius: 5000.0,
              bottomRadius: 5000.0
            }),
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
              Cesium.Cartesian3.fromDegrees(117.22222, 39.22222, 0)
            )
          })
        ],
        appearance: new Cesium.PolylineMaterialAppearance({
          flat: true,
          material: Cesium.Material.fromType('Color', {
            color: Cesium.Color.fromCssColorString('#ff0000').withAlpha(0.5)
          })
          // material: new Cesium.Material({
          //   fabric: {
          //     type: 'Color',
          //     uniforms: {
          //       color: Cesium.Color.fromCssColorString('#FCB718').withAlpha(0.5)
          //     }
          //   }
          // })
        })
      })
    )

    // * 圆柱（primitive，图片材质）
    viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: [
          new Cesium.GeometryInstance({
            geometry: new Cesium.CylinderGeometry({
              length: 50000.0,
              topRadius: 5000.0,
              bottomRadius: 5000.0
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                Cesium.Color.WHITE
              )
            },
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
              Cesium.Cartesian3.fromDegrees(117.33333, 39.33333, 0)
            )
          })
        ],
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: new Cesium.Material({
            fabric: {
              type: 'Image',
              uniforms: {
                image: require('@/assets/images/text.png'),
                radians: 10
              }
              // source: `
              //     #define M_PI 3.1415926535897932384626433832795
              //     uniform sampler2D image;
              //     uniform float radians;
              //     czm_material czm_getMaterial(czm_materialInput materialInput)
              //     {
              //       czm_material material = czm_getDefaultMaterial(materialInput);
              //       vec2 st = vec2(materialInput.st.x - 0.5, materialInput.st.y - 0.5);
              //       float alpha = 1.3 - st.x;
              //       float current_radians = atan(st.y, st.x);
              //       float radius = sqrt(st.x * st.x + st.y * st.y);
              //       if (radius < 0.50) {
              //         current_radians = current_radians - radians;
              //         st = vec2(cos(current_radians) * radius, sin(current_radians) * radius);
              //         st = vec2(st.x + 0.5, st.y + 0.5);
              //         vec4 colorImage = texture2D(image, st);
              //         material.diffuse = colorImage.rgb;
              //         material.alpha = colorImage.a * alpha;
              //       } else {
              //         material.alpha = 0.0;
              //       }

              //       return material;
              //     }
              //   `
            }
          })
        })
      })
    )

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      const pick = viewer.scene.pick(event.position)
      console.log('pick', pick)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  methods: {}
}
</script>

<style>
</style>